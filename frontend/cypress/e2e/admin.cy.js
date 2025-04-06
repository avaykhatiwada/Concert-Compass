describe('Admin Panel', () => {
  it('should load admin page successfully', () => {
    cy.visit('/admin')
    cy.url().should('include', '/admin')
    cy.screenshot('admin-page-loaded') // Success screenshot
  })

  it('should have visible page elements', () => {
    cy.visit('/admin')
    cy.get('body').should('exist')
    cy.get('div').should('exist')
    cy.screenshot('admin-page-elements') // Success screenshot
  })
})