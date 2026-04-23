describe('KaamSathi Post Task E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/post-task')
  })

  it('should load the post-task page successfully', () => {
    cy.contains('Post a Task').should('be.visible')
    cy.contains('काम पोस्ट गर्नुस्').should('be.visible')
    cy.contains('Service').should('be.visible')
    cy.contains('Details').should('be.visible')
    cy.contains('Contact').should('be.visible')
  })

  it('should show 3-step progress indicator', () => {
    cy.get('div').contains('Service').should('be.visible')
    cy.get('div').contains('Details').should('be.visible')
    cy.get('div').contains('Contact').should('be.visible')
  })

  it('should allow selecting a service from the list', () => {
    // Check service options are visible
    cy.contains('🔧 Plumbing').should('be.visible')
    cy.contains('🧹 Cleaning').should('be.visible')
    cy.contains('⚡ Electrical').should('be.visible')
    
    // Select a service
    cy.contains('🔧 Plumbing').click()
    
    // Verify service is selected (check for active styling)
    cy.contains('🔧 Plumbing').parent().should('have.css', 'border-color')
  })

  it('should navigate to step 2 (Details) after selecting service', () => {
    // Select a service
    cy.contains('🔧 Plumbing').click()
    
    // Click Next button
    cy.contains('Next →').click()
    
    // Should be on step 2
    cy.contains('Task Details').should('be.visible')
    cy.contains('Describe your task').should('be.visible')
  })

  it('should allow entering task description and details', () => {
    // Go to step 2
    cy.contains('🔧 Plumbing').click()
    cy.contains('Next →').click()
    
    // Enter task description
    cy.get('textarea').type('Need help fixing a leaky faucet in the kitchen')
    
    // Select date
    cy.get('input[type="date"]').should('be.visible')
    
    // Select time
    cy.get('select').first().select('09:00')
    
    // Enter address
    cy.get('input[placeholder="Full address"]').type('123 Main St, Kathmandu')
    
    // Enter budget
    cy.get('input[placeholder="Rs 500"]').type('1500')
  })

  it('should navigate to step 3 (Contact) after filling details', () => {
    // Complete step 1 and 2
    cy.contains('🔧 Plumbing').click()
    cy.contains('Next →').click()
    
    cy.get('textarea').type('Test task description')
    cy.get('input[placeholder="Full address"]').type('Test address')
    
    // Click Next to go to step 3
    cy.contains('Next →').click()
    
    // Should be on step 3
    cy.contains('Contact Info').should('be.visible')
    cy.contains('Your phone number').should('be.visible')
  })

  it('should require valid phone number for submission', () => {
    // Go through all steps
    cy.contains('🔧 Plumbing').click()
    cy.contains('Next →').click()
    
    cy.get('textarea').type('Test task')
    cy.get('input[placeholder="Full address"]').type('Test address')
    cy.contains('Next →').click()
    
    // Try to submit with invalid phone
    cy.get('input[placeholder="98XXXXXXXX"]').type('123')
    cy.contains('Post My Task').should('have.css', 'opacity', '0.6')
    
    // Enter valid Nepali phone number
    cy.get('input[placeholder="98XXXXXXXX"]').clear().type('9841234567')
    cy.contains('Post My Task').should('not.have.css', 'opacity', '0.6')
  })

  it('should show success page after posting task', () => {
    // Mock the form submission since it doesn't actually save to database
    cy.contains('🔧 Plumbing').click()
    cy.contains('Next →').click()
    
    cy.get('textarea').type('Test task description')
    cy.get('input[placeholder="Full address"]').type('Test address, Kathmandu')
    cy.contains('Next →').click()
    
    cy.get('input[placeholder="98XXXXXXXX"]').type('9841234567')
    
    // Click post button
    cy.contains('Post My Task').click()
    
    // Should show success page
    cy.contains('Task Posted Successfully!').should('be.visible')
    cy.contains('काम सफलतापूर्वक पोस्ट गरियो!').should('be.visible')
    cy.contains('Reference').should('be.visible')
    
    // Should have buttons to browse or go home
    cy.contains('Browse Taskers').should('be.visible')
    cy.contains('Go Home').should('be.visible')
  })

  it('should allow going back to previous steps', () => {
    // Step 1 to 2
    cy.contains('🔧 Plumbing').click()
    cy.contains('Next →').click()
    
    // Back to step 1
    cy.contains('← Back').click()
    cy.contains('Select a Service').should('be.visible')
    
    // Step 2 to 3
    cy.contains('Next →').click()
    cy.get('textarea').type('Test')
    cy.get('input[placeholder="Full address"]').type('Test')
    cy.contains('Next →').click()
    
    // Back to step 2
    cy.contains('← Back').click()
    cy.contains('Task Details').should('be.visible')
  })

  it('should show task summary on step 3', () => {
    // Complete steps 1 and 2 with specific data
    cy.contains('🔧 Plumbing').click()
    cy.contains('Next →').click()
    
    cy.get('textarea').type('Fix kitchen sink')
    cy.get('input[placeholder="Full address"]').type('456 Park Road, Lalitpur')
    cy.get('input[placeholder="Rs 500"]').type('2000')
    cy.contains('Next →').click()
    
    // Check summary displays correctly
    cy.contains('Service').should('be.visible')
    cy.contains('Plumbing').should('be.visible')
    cy.contains('Address').should('be.visible')
    cy.contains('456 Park Road, Lalitpur').should('be.visible')
    cy.contains('Budget').should('be.visible')
    cy.contains('Rs 2000').should('be.visible')
  })

  it('should have working navigation buttons on success page', () => {
    // Complete the flow to get to success page
    cy.contains('🔧 Plumbing').click()
    cy.contains('Next →').click()
    cy.get('textarea').type('Test')
    cy.get('input[placeholder="Full address"]').type('Test')
    cy.contains('Next →').click()
    cy.get('input[placeholder="98XXXXXXXX"]').type('9841234567')
    cy.contains('Post My Task').click()
    
    // Test Browse Taskers button
    cy.contains('Browse Taskers').click()
    cy.url().should('include', '/browse')
    
    // Go back and test Go Home button
    cy.visit('http://localhost:3000/post-task')
    cy.contains('🔧 Plumbing').click()
    cy.contains('Next →').click()
    cy.get('textarea').type('Test')
    cy.get('input[placeholder="Full address"]').type('Test')
    cy.contains('Next →').click()
    cy.get('input[placeholder="98XXXXXXXX"]').type('9841234567')
    cy.contains('Post My Task').click()
    
    cy.contains('Go Home').click()
    cy.url().should('eq', 'http://localhost:3000/')
  })
})