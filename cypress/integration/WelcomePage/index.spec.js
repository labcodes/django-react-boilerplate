/// <reference types="cypress" />

context("Welcome Page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/sample-api-view/", {
      fixture: "test_sample/test_sample_api_view/sample_api_view.json"
    }).as("getMessage");

    cy.visit("/");
  });

  it("renders page correctly", () => {
    cy.wait("@getMessage");
    cy.contains(
      ".welcome__message",
      "This message is coming from the backend. The django view is inside `project/urls.py` and the redux code is in `react-app/src/js/welcome/(actions|reducers).js`. Please remove them when starting your project :]"
    );

    cy.contains('a[href="/sample-nested-page/"]', " sample nested page");
  });

  it("navigates to sample nested page", () => {
    cy.get('a[href="/sample-nested-page/"]').click();
    cy.url().should("include", "/sample-nested-page/");
  });
});
