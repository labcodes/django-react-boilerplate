/// <reference types="cypress" />

context("Sample Nested Page", () => {
  beforeEach(() => {
    cy.visit("/sample-nested-page/");
  });

  it("renders page correctly", () => {
    cy.contains('a[href="/"]', "Back to home.");
  });

  it("navigates to home", () => {
    cy.get('a[href="/"]').click();
    cy.url().should("equal", `${Cypress.config("baseUrl")}/`);
  });
});
