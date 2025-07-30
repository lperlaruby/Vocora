/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// This new command will delete a test user from Supabase using the Supabase Admin API
Cypress.Commands.add("deleteTestUser", (email: string) => {
    // Fetch the user by email first
    cy.request({
      method: "GET",
      url: `${Cypress.env("SUPABASE_URL")}/auth/v1/admin/users`,
      headers: {
        apiKey: Cypress.env("SUPABASE_SERVICE_ROLE_KEY"),
        Authorization: `Bearer ${Cypress.env("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
    }).then((response) => {
      const user = response.body.users.find((user: any) => user.email === email);
      if (user) {
        // Gets the user ID from the response body
        const userId = user.id;
  
        // Delete the user using the user ID
        cy.request({
          method: "DELETE",
          url: `${Cypress.env("SUPABASE_URL")}/auth/v1/admin/users/${userId}`,
          headers: {
            apiKey: Cypress.env("SUPABASE_SERVICE_ROLE_KEY"),
            Authorization: `Bearer ${Cypress.env("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
        }).then((deleteResponse) => {
            // Verify if the user was deleted successfully
            expect(deleteResponse.status).to.equal(200);
        });
      } else {
        // Log a message if the user was not found
        cy.log(`User ${email} not found, skipping delete.`);
      }
    });
  });
  
  