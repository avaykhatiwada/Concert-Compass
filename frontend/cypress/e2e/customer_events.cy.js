describe('Customer Events Page', () => {
  it('should display events content', () => {
    cy.visit('/customer/events')
    
    // First verify basic page structure
    cy.url().should('include', '/customer/events')
    cy.get('body').should('exist')
    
    // Flexible content checks
    cy.get('body').then(($body) => {
      // Check for any event containers
      const eventContainer = $body.find('.events, [class*="event"], [data-testid*="event"]').first()
      if (eventContainer.length) {
        cy.wrap(eventContainer).should('be.visible')
      } else {
        // Fallback to text check
        cy.contains(/event|concert|show/i).should('exist')
      }
    })
  })
})