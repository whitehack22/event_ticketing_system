describe('Login Page with API Intercepts', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('logs in successfully with valid credentials', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          role: 'user',
          email: 'testuser@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
        token: 'mocked-jwt-token',
      },
    }).as('loginRequest');

    cy.get('input[placeholder="Email"]').type('testuser@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Wait for mock API call to finish
    cy.wait('@loginRequest');

    // Assert navigation to dashboard
    cy.url().should('include', '/user/dashboard/events');

    // Check that some element or text on the dashboard exists
    cy.contains('Welcome').should('exist'); // optional
  });

  it('shows error for invalid credentials', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: {
        message: 'Invalid email or password',
      },
    }).as('failedLogin');

    cy.get('[data-testid="login-email"]').type('wrong@example.com');
    cy.get('[data-testid="login-password"]').type('wrongpass');
    cy.get('[data-testid="login-submit-button"]').click();

    cy.wait('@failedLogin');

    // Assert toast or error appears
    cy.contains('Login failed').should('exist');
  });
});
