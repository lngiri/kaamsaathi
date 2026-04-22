describe('KaamSathi E2E Tests', () => {
  it('should load the home page successfully', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Get Any Task Done').should('be.visible')
    cy.contains('Popular Services').should('be.visible')
  })

  it('should display navbar with hero section', () => {
    cy.visit('http://localhost:3000/')
    
    // Check hero section exists
    cy.contains('2,400+').should('be.visible')
    cy.contains('verified taskers across Nepal').should('be.visible')
    cy.contains('जुनसुकै काम, नेपालमै गराउनुस्').should('be.visible')
  })

  it('should have Find a Tasker and Become a Tasker buttons', () => {
    cy.visit('http://localhost:3000/')
    
    // Check buttons exist and are visible
    cy.get('button').contains('Find a Tasker').should('be.visible')
    cy.get('button').contains('Become a Tasker').should('be.visible')
  })

  it('should display search bar with city selector', () => {
    cy.visit('http://localhost:3000/')
    
    // Check search input
    cy.get('input[placeholder*="What do you need"]').should('be.visible')
    
    // Check search button
    cy.get('button').contains('Search').should('be.visible')
    
    // Check city selector exists
    cy.get('select').should('be.visible')
  })

  it('should allow searching for services', () => {
    cy.visit('http://localhost:3000/')
    
    // Fill in search input with a delay
    cy.get('input[placeholder*="What do you need"]')
      .should('be.visible')
      .type('Plumber', { delay: 100 })
    
    // Click search button
    cy.get('button').contains('Search').click()
    
    // Should navigate with search params
    cy.url({ timeout: 10000 }).should('include', '/browse')
    cy.url().should('include', 'search=Plumber')
  })

  it('should display how it works section', () => {
    cy.visit('http://localhost:3000/')
    
    // Scroll to how it works section
    cy.contains('How It Works').should('be.visible')
    cy.contains('Post Your Task').should('be.visible')
    cy.contains('Get Matched').should('be.visible')
    cy.contains('Task Done!').should('be.visible')
  })

  it('should display stats correctly', () => {
    cy.visit('http://localhost:3000/')
    
    // Check all stats are visible
    cy.contains('4.8★').should('be.visible')
    cy.contains('15,000+').should('be.visible')
    cy.contains('30 min').should('be.visible')
  })
})
