/// <reference types="cypress" />

describe("Favorite and Unfavorite Movie Flow", () => {
    it("should login, favorite a movie, verify in favorites, unfavorite it, and verify removal", () => {

      cy.visit("https://filmscope-cis658.onrender.com/");
  
      cy.get('[data-testid="username-input"]', { timeout: 15000 }).should("be.visible");

        //login
      cy.get('[data-testid="username-input"]').type("sai@gmail.com");
      cy.get('[data-testid="password-input"]').type("Surisurendra3399.!");
      cy.get('[data-testid="login-user-button"]').click();
  
      // movie page
      cy.get('[data-testid^="favorite-icon-"]', { timeout: 20000 }).first().should("be.visible");
  
      // favorite the first movie
      cy.get('[data-testid^="favorite-icon-"]').first().click();
  
      //  favorites page
      cy.contains("View Favorites").click();
      cy.url().should("include", "/favorites");
  
      // favorite movie is listed
      cy.get("h1").should("contain", "My Favorite Movies");
      cy.get('[data-testid^="remove-favorite-"]').should("exist");
  
      // unfav the movie
      cy.get('[data-testid^="remove-favorite-"]').first().click();
  
      cy.contains("No favorite movies added.").should("be.visible");
  
      //  movies page
      cy.contains("Back to Movies").click();
      cy.url().should("include", "/movies");
    });
  });
  