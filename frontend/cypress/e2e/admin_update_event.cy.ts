describe('Admin Events - Update Event Flow', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/dashboard/events');

    // Intercept mock update event request
    cy.intercept('PUT', '**/event/**', {
      statusCode: 200,
      body: {
        message: 'Event updated successfully',
        data: {
          eventID: 999,
          title: 'Updated Event Title',
        },
      },
    }).as('updateEvent');

    // // Intercept cloudinary mock image upload
    // cy.intercept('POST', '**cloudinary.com/**', {
    //   statusCode: 200,
    //   body: {
    //     secure_url: 'https://via.placeholder.com/150',
    //   },
    // }).as('mockImageUpload');
  });

  it('opens update modal, updates form, mocks image upload, and submits successfully', () => {
    // Open the update modal
    cy.get('[data-testid="edit-event-button"]').first().click();

    // Update form fields
    cy.get('[data-testid="update-title"]').clear().type('Updated Event Title');
    cy.get('[data-testid="update-description"]').clear().type('Updated description');
    cy.get('[data-testid="update-category"]').select('Art');
    cy.get('[data-testid="update-eventDate"]').type('2025-09-01');
    cy.get('[data-testid="update-startTime"]').type('10:00');
    cy.get('[data-testid="update-endTime"]').type('14:00');
    cy.get('[data-testid="update-ticketPrice"]').clear().type('500');
    cy.get('[data-testid="update-totalTickets"]').clear().type('200');
    cy.get('[data-testid="update-availableTickets"]').clear().type('180');
    cy.get('[data-testid="update-venueID"]').clear().type('2');

    // // Mock image upload
    // cy.get('[data-testid="update-image"]').selectFile('cypress/fixtures/sample2-image.jpeg', { force: true });
    // cy.wait('@mockImageUpload');

    // Submit update
    cy.get('[data-testid="update-submit-button"]').click();
    cy.wait('@updateEvent');

    // Confirm success
    cy.contains('Event updated successfully!').should('be.visible');
  });
});
