describe('Platform e2e Tests', () => {
  it('Visits and validates the page of platforms list and create a new platform', () => {
    cy.visit('/')
    cy.contains('Administración').click()
    cy.contains('Plataformas').click()
    cy.get('.platform-table tbody tr').should('have.length.at.least', 1)
    cy.get('.tittle-heading-platform').should('contain', 'Crear una plataforma')
    cy.get('#namePlatform').type(generateRandomText())
    cy.get('#webSiteUrl').type('https://cdn.pixabay.com/photo/2022/01/11/21/48/link-6931554_1280.png')
    cy.get('.btn-save-platform').click()
    cy.get('.toast-success').should('be.visible')
    cy.get('.toast-success').click()
    cy.get('#namePlatform').should('have.value', '')
    cy.get('#webSiteUrl').should('have.value', '')
  })

  function generateRandomText() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < 10; i++) {
      text += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return text;
  }
})
