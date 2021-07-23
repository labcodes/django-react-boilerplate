/// <reference types="cypress" />

context("Welcome Page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/sample-api-view/", {
      fixture: "WelcomePage/sample-api-view.json"
    }).as("getMessage");

    cy.visit("/");
  });

  it("renders page correctly", () => {
    cy.contains(
      ".welcome__message",
      "Welcome Message is being fetched from the API..."
    );
    cy.wait("@getMessage");
    cy.contains(".welcome__message", "This is a stubbed message!");

    cy.contains('a[href="/sample-nested-page/"]', " sample nested page");
  });

  it("navigates to sample nested page", () => {
    cy.get('a[href="/sample-nested-page/"]').click();
    cy.url().should("include", "/sample-nested-page/");
  });
});
