describe('Admin Events - Create Event Flow', () => {
  beforeEach(() => {
    cy.loginAsAdmin(); // Ensure admin is logged in
    cy.visit('/admin/dashboard/events'); // Go to events page
  });

  it('opens create event modal, fills form, mocks image upload, and submits successfully', () => {
    // Intercept the POST request to create an event
    cy.intercept('POST', '**/event', {
      statusCode: 201,
      body: {
        message: 'Event created successfully',
        data: {
          eventID: 999,
          title: 'Mocked Event',
        },
      },
    }).as('createEvent');

    cy.intercept('POST', '**cloudinary.com/**', {
    statusCode: 200,
    body: {
        secure_url: 'https://via.placeholder.com/150',
    },
    }).as('mockImageUpload');

    // Open the Create Event modal
    cy.get('[data-testid="open-create-event-modal"]').click();

    // Fill in form fields
    cy.get('[data-testid="create-title"]').type('Cypress Test Event');
    cy.get('[data-testid="create-description"]').type('A test event created by Cypress');
    cy.get('[data-testid="create-category"]').select('Tech');
    cy.get('[data-testid="create-eventDate"]').type('2025-08-15');
    cy.get('[data-testid="create-startTime"]').type('09:00');
    cy.get('[data-testid="create-endTime"]').type('12:00');
    cy.get('[data-testid="create-ticketPrice"]').type('300');
    cy.get('[data-testid="create-totalTickets"]').type('100');
    cy.get('[data-testid="create-availableTickets"]').type('100');
    cy.get('[data-testid="create-venueID"]').type('1');

    // Mock image upload by injecting a fake Cloudinary URL directly
    const mockImageUrl = 'https://via.placeholder.com/150';
    cy.get('[data-testid="create-image-url-hidden"]').selectFile('cypress/fixtures/sample-image.jpeg', { force: true });

    // Submit form
    cy.get('[data-testid="create-submit-button"]').click();

    // Assert that POST was made
    cy.wait('@createEvent');

    // Confirm success toast
    cy.contains('Event created successfully!').should('be.visible');
  });
});
