describe('Booking Modal Flow', () => {
  it('should open the booking modal and lock background scroll', () => {
    // 1. Visit the home page
    cy.visit('http://localhost:3000/')

    // 2. Click on "Book Now" for a featured tasker
    // Note: Adjust the selector if your button text is different
    cy.contains('Book Now').first().click()

    // 3. Verify the modal is visible
    cy.get('h3').contains('Book').should('be.visible')

    // 4. Verify background scroll lock
    cy.get('body').should('have.css', 'overflow', 'hidden')
    cy.get('html').should('have.css', 'overflow', 'hidden')

    // 5. Close the modal
    cy.get('button').contains('✕').click()

    // 6. Verify scroll is restored
    cy.get('body').should('not.have.css', 'overflow', 'hidden')
  })
})