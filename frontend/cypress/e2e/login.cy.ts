describe('Login Page with API Intercepts', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('registers a user successfully', () => {
  cy.intercept('POST', '**/users', {
    statusCode: 201,
    body: {
      message: 'User created successfully',
      user: {
        email: 'newuser@example.com',
      },
    },
  }).as('registerRequest');

  cy.get('[data-testid="register-firstName"]').type('Jane');
  cy.get('[data-testid="register-lastName"]').type('Doe');
  cy.get('[data-testid="register-email"]').type('newuser@example.com');
  cy.get('[data-testid="register-contactPhone"]').type('0712345678');
  cy.get('[data-testid="register-address"]').type('Nairobi');
  cy.get('[data-testid="register-password"]').type('securePass123');
  cy.get('[data-testid="register-confirmPassword"]').type('securePass123');

  cy.get('button[type="submit"]').click();

  // Ensure the API was hit and got the mocked response
  cy.wait('@registerRequest').its('response.statusCode').should('eq', 201);

  // Wait for redirect to complete
  cy.url({ timeout: 5000 }).should('include', '/register/verify');
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
    cy.get('button[type="submit"]').click();

    cy.wait('@failedLogin');

    // Assert toast or error appears
    cy.contains('Login failed').should('exist');
  });
});
