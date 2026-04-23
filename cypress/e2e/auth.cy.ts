describe('KaamSathi Authentication E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/auth')
  })

  it('should load the auth page successfully', () => {
    cy.contains('KaamSathi').should('be.visible')
    cy.contains('काम साथी').should('be.visible')
    cy.contains('Login / साइन इन').should('be.visible')
    cy.contains('Sign Up / दर्ता').should('be.visible')
  })

  it('should toggle between login and signup modes', () => {
    // Default should be signup
    cy.contains('Create Customer Account').should('be.visible')
    
    // Click login button
    cy.contains('Login / साइन इन').click()
    cy.contains('Welcome back!').should('be.visible')
    cy.contains('Sign in to your KaamSathi account').should('be.visible')
    
    // Click signup button again
    cy.contains('Sign Up / दर्ता').click()
    cy.contains('Create Customer Account').should('be.visible')
  })

  it('should toggle between customer and tasker auth types', () => {
    // Default should be customer
    cy.contains('Create Customer Account').should('be.visible')
    cy.contains('Want to earn?').should('be.visible')
    
    // Click "Join as Tasker" link
    cy.contains('Join as Tasker').click()
    
    // Should switch to tasker auth
    cy.url().should('include', 'type=tasker')
    cy.contains('Create Tasker Account').should('be.visible')
    cy.contains('Want to hire instead?').should('be.visible')
    
    // Click "Sign up as Customer" link
    cy.contains('Sign up as Customer').click()
    
    // Should switch back to customer auth
    cy.url().should('include', 'type=customer')
    cy.contains('Create Customer Account').should('be.visible')
  })

  it('should toggle between email and phone authentication methods', () => {
    // Default should be email
    cy.get('input[type="email"]').should('be.visible')
    cy.contains('Send Magic Link').should('be.visible')
    
    // Click phone button
    cy.contains('Phone / फोन').click()
    
    // Should show phone input
    cy.contains('+977').should('be.visible')
    cy.get('input[type="tel"]').should('be.visible')
    cy.contains('Send OTP').should('be.visible')
    
    // Click email button again
    cy.contains('Email').click()
    cy.get('input[type="email"]').should('be.visible')
  })

  it('should validate email input', () => {
    // Try to submit with invalid email
    cy.get('input[type="email"]').type('invalid-email')
    cy.contains('Send Magic Link').click()
    
    // Should show error message
    cy.contains('❌ Please enter a valid email').should('be.visible')
  })

  it('should validate phone input format', () => {
    // Switch to phone method
    cy.contains('Phone / फोन').click()
    
    // Try with too short number
    cy.get('input[type="tel"]').type('123')
    cy.contains('Send OTP').should('have.attr', 'disabled')
    
    // Try with invalid format (not starting with 98)
    cy.get('input[type="tel"]').clear().type('9712345678')
    cy.contains('Send OTP').click()
    
    // Should show error message
    cy.contains('❌ Enter valid Nepali number (98XXXXXXXX)').should('be.visible')
  })

  it('should show OTP input after sending OTP', () => {
    // This test would require mocking the Supabase OTP send
    // For now, just verify the UI flow exists
    cy.contains('Phone / फोन').click()
    cy.get('input[type="tel"]').should('be.visible')
    cy.contains('Send OTP').should('be.visible')
    
    // Note: Actual OTP sending would require Supabase integration
    // and is better tested with unit tests or mocked API calls
  })

  it('should have working navigation to homepage', () => {
    // Click on the KaamSathi logo
    cy.contains('KaamSathi').click()
    
    // Should navigate to homepage
    cy.url().should('eq', 'http://localhost:3000/')
    cy.contains('Get Any Task Done').should('be.visible')
  })

  it('should display benefits for customer auth', () => {
    // Verify customer benefits are shown
    cy.contains('2,400+ verified taskers').should('be.visible')
    cy.contains('Find taskers nearby').should('be.visible')
    cy.contains('Pay via eSewa / Khalti').should('be.visible')
    cy.contains('Real reviews & ratings').should('be.visible')
  })

  it('should display benefits for tasker auth', () => {
    // Switch to tasker auth
    cy.contains('Join as Tasker').click()
    
    // Verify tasker benefits are shown
    cy.contains('Earn Rs 600-1,500/hr').should('be.visible')
    cy.contains('Work on your schedule').should('be.visible')
    cy.contains('Insurance included').should('be.visible')
    cy.contains('Free app & tools').should('be.visible')
  })
})