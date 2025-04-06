// concert_booking.cy.js
describe('Concert Booking Flow', () => {
  it('should load the homepage', () => {
    cy.visit('/')
    // Update the selector below to match text or elements on your actual homepage
    cy.contains('ConcertCompass').should('be.visible')
  })
})