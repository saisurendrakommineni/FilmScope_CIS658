/// <reference types="cypress" />

describe("Favorite and Unfavorite Movie Flow", () => {
    it("should login, favorite a movie, verify in favorites, unfavorite it, and verify removal", () => {

      cy.visit("https://filmscope-cis658.onrender.com/");
  
      cy.get('[data-testid="username-input"]', { timeout: 15000 }).should("be.visible");

        //login
      cy.get('[data-testid="username-input"]').type("sai@gmail.com");
      cy.get('[data-testid="password-input"]').type("Saisurendra123.!");
      cy.get('[data-testid="login-user-button"]').click();
  
      // movie page
      cy.get('[data-testid^="favorite-icon-"]', { timeout: 20000 }).first().should("be.visible");
  
      // favorite the first movie if not
      cy.get('[data-testid^="favorite-icon-"]').first().then(($icon) => {
        const isFavorited = $icon.css("color") === "rgb(255, 0, 0)"; 
        if (!isFavorited) {
          cy.intercept("POST", "/api/favorites/add/**").as("addFavorite");
          cy.wrap($icon).click();
          cy.wait("@addFavorite");
        }
      });  
      //  favorites page
      cy.intercept("GET", "/api/favorites/**").as("getFavorites");
      cy.contains("View Favorites").click();
      cy.wait("@getFavorites");
      cy.url().should("include", "/favorites");
  
      // favorite movie is listed
      cy.get("h1").should("contain", "My Favorite Movies");
      cy.get('[data-testid^="remove-favorite-"]', { timeout: 10000 }).should("exist");
  
      // unfav the movie
      cy.get('[data-testid^="remove-favorite-"]').first().click();
  
      //  movies page
      cy.contains("Back to Movies").click();
      cy.url().should("include", "/movies");
    });
  });
  