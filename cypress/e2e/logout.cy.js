/// <reference types="cypress" />
/* global cy, describe, beforeEach  it */
describe("Logout Functionality", () => {
  it("should logout and navigate to login", () => {
    cy.visit("http://localhost:5173/resume_templates");

    // Simulate user already logged in
    window.localStorage.setItem("isLoggedIn", "true");

    // Click Logout button
    cy.get("button").contains("Logout").click();

    // After logout, should navigate to login
    cy.url().should("include", "/login");
  });
});
beforeEach(() => {
  // Clear localStorage/sessionStorage before each test
  cy.clearLocalStorage();
  cy.clearCookies();
});
