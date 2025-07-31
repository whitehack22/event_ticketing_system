describe('Registration Page with API Intercepts', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('registers a user successfully', () => {
    cy.intercept('POST', '**/user', {
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

    cy.wait('@registerRequest');

    // Should be redirected to /register/verify
    cy.url().should('include', '/register/verify');

    // Optionally assert something on the verification page
    // cy.contains('Check your email').should('exist');
  });

  it('shows error if email already exists', () => {
    cy.intercept('POST', '**/user', {
      statusCode: 500,
      body: {
        message: 'Error creating user:',
      },
    }).as('registerConflict');

    cy.get('[data-testid="register-firstName"]').type('Jane');
    cy.get('[data-testid="register-lastName"]').type('Doe');
    cy.get('[data-testid="register-email"]').type('existinguser@example.com');
    cy.get('[data-testid="register-contactPhone"]').type('0712345678');
    cy.get('[data-testid="register-address"]').type('Nairobi');
    cy.get('[data-testid="register-password"]').type('securePass123');
    cy.get('[data-testid="register-confirmPassword"]').type('securePass123');

    cy.get('button[type="submit"]').click();

    cy.wait('@registerConflict');

    // Assert toast error appears
    cy.contains('Registration failed').should('exist');
  });
});
