/// <reference types="cypress" />
/* global cy, describe  it */
describe("Full User Journey Test: Signup, Login, Resume Creation, Logout", () => {
  it("should signup, login, fill resume, preview, download, and logout successfully", () => {
    const timestamp = Date.now();
    const randomUsername = `user${timestamp}`;
    const randomEmail = `user${Date.now()}@example.com`;
    const password = "password123";

    // 1. Visit Signup Page
    cy.visit("http://localhost:5173/signup");

    // Fill signup form
    cy.get('input[placeholder="Username"]').type(randomUsername);
    cy.get('input[placeholder="Email"]').type(randomEmail);
    cy.get('input[placeholder="Password"]').type(password);
    cy.get("button").contains("Sign Up").click();

    // 2. After signup, should go to Login Page
    cy.url().should("include", "/login");

    // Fill login form
    cy.get('input[placeholder="Email"]').type(randomEmail);
    cy.get('input[placeholder="Password"]').type(password);
    cy.get("button").contains("Login").click();

    // 3. After login, should be at userDashboard then templates page
    // Check if landed on users dashboard
    cy.url().should("include", "/users_dashboard");

    // Click on Resume Templates button or link
    cy.contains("Resume Templates").click();

    // Now check if moved to resume templates page
    cy.url().should("include", "/resume_templates");

    // Then continue selecting Template 1
    cy.contains("Resume 1").click();

    // 4. Fill Resume Form
    cy.get('input[name="fullName"]').type("John Doe");
    cy.get('input[name="email"]').type(randomEmail);
    cy.get('input[name="phone"]').type("1234567890");
    cy.get('input[name="address"]').type("123 Main Street");
    cy.get('input[name="linkedin"]').type("https://linkedin.com/in/johndoe");
    cy.get('textarea[name="profile_summary"]').type(
      "Passionate Software Developer"
    );
    cy.get('textarea[name="key_skills"]').type("JavaScript, React, Node.js");

    cy.get('textarea[name="workExperience-0"]').type(
      "Software Engineer at XYZ Corp"
    );
    cy.get('textarea[name="Education-0"]').type(
      "Bachelor of Technology in Computer Science"
    );
    cy.get('textarea[name="Certifications-0"]').type(
      "AWS Certified Solutions Architect"
    );
    cy.get('textarea[name="Projects-0"]').type("Resume Builder Application");
    cy.get('textarea[name="Research Publications-0"]').type(
      "Paper on Cloud Computing 2024"
    );
    cy.get('textarea[name="Awards-0"]').type("Employee of the Year 2023");
    cy.get('textarea[name="Professional Membership-0"]').type("Member of IEEE");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // 5. Verify Preview Page
    cy.url().should("include", "/resume_preview");
    cy.contains("John Doe");

    // Download PDF (optional check)
    cy.contains("Download as PDF").click();

    // 6. Logout
    cy.get("button").contains("Logout").click();

    // 7. After logout, should return to login page
    cy.url().should("include", "/login");
  });
});
