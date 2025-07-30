describe("User Login Test", () => {
    it("should allow a user to sign in with email and password", () => {
      // Visit the Log In page
      cy.visit("http://localhost:3000/login");

      // Login the form
      cy.get("input[name='email']").type("user@test.com");
      cy.get("input[name='password']").type("123456");
      
      // Click the "Sign In" button
      cy.get("button[type='submit']").click();

      // Verify URL changed to sign in page
      cy.url().should("include", "/success");
    });
      
    it("should show the Google Sign In button", () => {
      // Visit the Sign Up page
      cy.visit("http://localhost:3000/login");

      // Verify the "Sign Up with Google" button is visible
      cy.contains("Sign in with Google").should("exist").click();
    });
  });
  