/// <reference types="cypress" />
/* global cy, describe, beforeEach  it */
describe("Signup Page", () => {
  it("should fill signup form and navigate to login", () => {
    cy.visit("http://localhost:5173/signup");

    cy.get('input[placeholder="Username"]').type("testuser1");
    cy.get('input[placeholder="Email"]').type("testuser@example.com");
    cy.get('input[placeholder="Password"]').type("password123");
    cy.get("button").contains("Sign Up").click();

    // After signup, should be redirected to login
    cy.url().should("include", "/login");
  });
});
beforeEach(() => {
  // Clear localStorage/sessionStorage before each test
  cy.clearLocalStorage();
  cy.clearCookies();
});
