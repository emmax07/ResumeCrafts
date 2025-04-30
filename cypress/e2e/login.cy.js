/// <reference types="cypress" />
/* global cy, describe, beforeEach  it */

describe("Login Page", () => {
  it("should login and navigate to resume templates", () => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[placeholder="Email"]').type("testuser@example.com");
    cy.get('input[placeholder="Password"]').type("password123");
    cy.get("button").contains("Login").click();

    // After login, should navigate to resume templates
    cy.url().should("include", "/resume_templates");
  });
});
beforeEach(() => {
  // Clear localStorage/sessionStorage before each test
  cy.clearLocalStorage();
  cy.clearCookies();
});
