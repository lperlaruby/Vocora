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

  try {
    const { userId, reason } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    console.log(`Deleting incomplete user: ${userId}, reason: ${reason}`);

    // Delete the user from Supabase Auth
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      console.error('Error deleting user:', deleteUserError);
      return res.status(500).json({ error: 'Failed to delete user', details: deleteUserError.message });
    }

    // Clean up any related data (user_preferences, user_streaks, etc.)
    const cleanupPromises = [
      supabaseAdmin.from('user_preferences').delete().eq('uid', userId),
      supabaseAdmin.from('user_streaks').delete().eq('uid', userId),
      // Add other tables that might have user data
    ];

    await Promise.allSettled(cleanupPromises);

    console.log(`Successfully deleted incomplete user: ${userId}`);
    return res.status(200).json({ success: true, message: 'User deleted successfully' });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
