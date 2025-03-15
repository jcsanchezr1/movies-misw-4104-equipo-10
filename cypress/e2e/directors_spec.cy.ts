describe('Director e2e Tests', () => {
  it('Visits and validates the page of directors list', () => {
    cy.visit('/')
    cy.contains('Directores').click()
    cy.url().should('include', '/directors/list')
    cy.get('.col h1.tittle-heading').should('contain', 'Directores')
    cy.get('.card').should('have.length.at.least', 1)
    cy.get('.search-input').type('Alana Strettell')
    cy.get('.card').should('have.length', 1)
  })

  it('Visits and validates the page of director detail', () => {
    cy.visit('/')
    cy.contains('Directores').click()
    cy.url().should('include', '/directors/list')
    cy.get('.col h1.tittle-heading').should('contain', 'Directores')
    cy.get('.card').should('have.length.at.least', 1)
    cy.get('.search-input').type('Alana Strettell')
    cy.get('.card').should('have.length', 1)
    cy.get('.card').click()
    cy.get('.director-photo').should('exist')
    cy.contains('.director-name', 'Alana Strettell')
  })

  it('Visits and validates the page of create director', () => {
    cy.visit('/')
    cy.contains('Administración').click()
    cy.contains('Crear director').click()
    cy.get('#directorName').type('Billy McBucket')
    cy.get('#directorPhoto').type('https://cdn.pixabay.com/photo/2022/01/11/21/48/link-6931554_1280.png')
    cy.get('#directorNationality').type('Colombian')
    cy.get('#directorBirthDate').type('1990-01-01', { force: true });
    cy.get('#directorBiography').type('Biography', { force: true })
    cy.get('.btn-save-director').click()
    cy.get('.toast-success').should('be.visible')
    cy.get('.toast-success').click()
    cy.get('#directorName').should('have.value', '')
  })
})
