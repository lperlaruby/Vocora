// This file is used to extend the Cypress chainable commands

declare namespace Cypress {
    interface Chainable {
      deleteTestUser(email: string): Chainable<void>;
    }
}
  