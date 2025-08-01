describe('Admin Dashboard', () => {
  beforeEach(() => {
    // fake login state if dashboard is protected
    //  cy.setLocalStorage('token', 'mocked-jwt-token');
    //  cy.setLocalStorage('user', JSON.stringify({ role: 'admin' }));
     cy.loginAsAdmin();
  });

  it('displays the dashboard with layout and drawer', () => {
    // Welcome message
    cy.contains('Welcome to the Admin Dashboard').should('be.visible');

    // Drawer is expanded by default
    cy.get('[data-testid="admin-drawer"]').should('have.class', 'w-64');

    // Main content area is visible
    cy.get('[data-testid="dashboard-content"]').should('exist');
  });

  it('toggles drawer when drawer toggle button is clicked', () => {
    // Initially expanded
    cy.get('[data-testid="admin-drawer"]').should('have.class', 'w-64');

    // Click to collapse
    cy.get('[data-testid="drawer-toggle"]').click();
    cy.get('[data-testid="admin-drawer"]').should('have.class', 'w-16');

    // Click again to expand
    cy.get('[data-testid="drawer-toggle"]').click();
    cy.get('[data-testid="admin-drawer"]').should('have.class', 'w-64');
  });
});
