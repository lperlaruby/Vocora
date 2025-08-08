import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with admin privileges (service role key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for API key to prevent unauthorized access
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.CLEANUP_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Starting cleanup of incomplete user accounts...');

    // Get all users from Supabase Auth
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    let deletedCount = 0;
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 24); // Delete accounts older than 24 hours without preferences

    for (const user of users) {
      try {
        // Check if user has language preferences
        const { data: preferences } = await supabaseAdmin
          .from('user_preferences')
          .select('preferred_lang, practice_lang')
          .eq('uid', user.id)
          .maybeSingle();

        // Check if user was created more than 24 hours ago
        const userCreatedAt = new Date(user.created_at);
        const isOldEnough = userCreatedAt < cutoffTime;

        // If user has no preferences and account is old enough, delete it
        if ((!preferences?.preferred_lang || !preferences?.practice_lang) && isOldEnough) {
          console.log(`Deleting incomplete user: ${user.id} (created: ${user.created_at})`);

          // Delete the user
          const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

          if (deleteError) {
            console.error(`Failed to delete user ${user.id}:`, deleteError);
            continue;
          }

          // Clean up related data
          await Promise.allSettled([
            supabaseAdmin.from('user_preferences').delete().eq('uid', user.id),
            supabaseAdmin.from('user_streaks').delete().eq('uid', user.id),
          ]);

          deletedCount++;
        }
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        continue;
      }
    }

    console.log(`Cleanup completed. Deleted ${deletedCount} incomplete accounts.`);
    return res.status(200).json({ 
      success: true, 
      message: `Cleanup completed. Deleted ${deletedCount} incomplete accounts.`,
      deletedCount 
    });

  } catch (error) {
    console.error('Unexpected error during cleanup:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
