describe('The actors feature', () => {

  it('Listing an actor using the search bar', () => {
    cy.visit('/')
    cy.contains('Actores').click()
    cy.get('input[placeholder="Buscar actor"]').type('Niles Pail')
    cy.contains('jun 29, 1936')
    cy.get('p.card-text').should('have.text', 'jun 29, 1936');
  })

  it('see details of a specific actor bar', () => {
    cy.visit('/')
    cy.contains('Actores').click()
    cy.get('input[placeholder="Buscar actor"]').type('Dorene Phlipon')
    cy.get('.card').click()
    cy.get('div.actor-name').should('contain', 'Dorene Phlipon');
    cy.get('div.actor-biography').should('contain', 'Focused analyzing software');
  })

  it('create an actor with every field', () => {
    cy.visit('/')
    cy.contains('Administración').click();
    cy.contains('Crear actor').click();
    cy.get('#name').type('Ian Zoe Malu');
    cy.get('#photo').type('https://wwww.google.com');
    cy.get('#nationality').type('Colombiano');
    cy.get('#birthDate').type('2024-05-02', { force: true });
    cy.get('#biography').type('Biografia de una linda familia', { force: true });
    cy.contains('Guardar').click();
    cy.get('.toast-success').should('be.visible');
  })


})
