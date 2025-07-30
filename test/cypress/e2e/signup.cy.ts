describe("User Signup Test", () => {
    let tempEmail: string;
  
    before(() => {
      // Generate a random email for regular sign-up
      tempEmail = `testuser+${Date.now()}@mailinator.com`;
    });

    after(() => {
      // Clean up the test user after the test suite
      cy.deleteTestUser(tempEmail);
    });
  
    it("should allow a user to sign up with email and password", () => {
      // Visit the Sign Up page
      cy.visit("http://localhost:3000/signup");
    
      cy.get("input[name='firstName']").type("Test");
      cy.get("input[name='lastName']").type("User");
      cy.get("input[name='email']").type(tempEmail);
      cy.get("input[name='password']").type("SecurePassword123");
    
      // Intercept the sign-up request
      cy.intercept("POST", "https://your-supabase-endpoint.com/auth/v1/signup").as("signUpRequest");
    
      // Click the "Sign Up" button
      cy.get("button[type='submit']").click();

      // Verify URL changed to sign in page
      cy.url().should("include", "/success");
    });
      
    it("should show the Google Sign Up button", () => {
      // Visit the Sign Up page
      cy.visit("http://localhost:3000/signup");

      // Verify the "Sign Up with Google" button is visible
      cy.contains("Sign up with Google").should("exist").click();
    });
  });
  