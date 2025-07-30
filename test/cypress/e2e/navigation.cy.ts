describe("Navigation Test", () => {
  it("should navigate to the signup page when clicking Sign Up", () => {
    // Visit homepage
    cy.visit("http://localhost:3000/");

    // Click on the Sign Up button
    cy.contains("Sign Up").click();

    // Verify URL changed to sign in page
    cy.url().should("include", "/signup");

    // Verify the sign up page has the correct title
    cy.contains("Sign up").should("be.visible");
  });

  it("should navigate to the sign in page when clicking Log In", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Log In").click();
    cy.url().should("include", "/login");
    cy.contains("Sign in").should("be.visible");
  });

  it("should navigate to the sign in page when clicking Let's Get Started", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Let's Get Started").click();
    cy.url().should("include", "/login");
    cy.contains("Sign in").should("be.visible");
  });

  it("should navigate to the signup page when clicking the link on the sign in page", () => {
    cy.visit("http://localhost:3000/login");
    cy.contains("Sign Up").click();
    cy.url().should("include", "/signup");
    cy.contains("Sign up").should("be.visible");

    cy.visit("http://localhost:3000/login");
    cy.contains("Don't have an account? Sign up").click();
    cy.url().should("include", "/signup");
    cy.contains("Sign up").should("be.visible");
  });

  it("should navigate to the sign in page when clicking the link on the signup page", () => {
    cy.visit("http://localhost:3000/signup");
    cy.contains("Log In").click();
    cy.url().should("include", "/login");
    cy.contains("Sign in").should("be.visible");

    cy.visit("http://localhost:3000/signup");
    cy.contains("Already have an account? Sign in").click();
    cy.url().should("include", "/login");
    cy.contains("Sign in").should("be.visible");
  });
});
