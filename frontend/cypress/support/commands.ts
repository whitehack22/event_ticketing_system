/// <reference types="cypress" />

Cypress.Commands.add('getDataTest', (dataTestSelector) => {
    return cy.get(`[data-testid="${dataTestSelector}"]`)
})


//login Admin user
Cypress.Commands.add('loginAsAdmin', (email = 'githaigaraizzy@gmail.com', password = 'password123') => {
    cy.visit('/login')
    cy.getDataTest('login-email').type(email)
    cy.getDataTest('login-password').type(password)
    cy.getDataTest('login-submit-button').click()
    cy.url().should('include', 'admin/dashboard/events')
    

})

//login as User
Cypress.Commands.add('loginAsUser', (email = 'mugoryan2@gmail.com', password = 'password123') => {
    cy.visit('/login')
    cy.getDataTest('login-email').type(email)
    cy.getDataTest('login-password').type(password)
    cy.getDataTest('login-submit-button').click()
    cy.url().should('include', 'user/dashboard/events')
    

})



/* eslint-disable @typescript-eslint/no-namespace */
export { } // means this file is a module, so we can augment the Cypress namespace
declare global { // adding new types to the global scope.
    namespace Cypress { //adding to the Cypress types
        interface Chainable { //means we are extending the Cypress namespace with our own custom commands
            getDataTest(value: string): Chainable<JQuery<HTMLElement>>;
            loginAsAdmin(email: string, password: string): Chainable<void>;
            loginAsUser(email: string, password: string): Chainable<void>;
        }
    }
} 



















