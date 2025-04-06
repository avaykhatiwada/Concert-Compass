describe('Homepage', () => {
    it('should load successfully', () => {
      cy.visit('/')
      cy.url().should('eq', 'http://localhost:3000/')
      cy.get('body').should('exist')
      cy.screenshot('homepage-loaded') // Full page screenshot
      cy.get('header').screenshot('homepage-header') // Specific component
    })
  
    it('should have at least one link', () => {
      cy.visit('/')
      cy.get('a').first().should('exist').screenshot('first-link') // Screenshot first link
    })
  })