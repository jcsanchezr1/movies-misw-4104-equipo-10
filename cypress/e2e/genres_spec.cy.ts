describe('The Genres feature', () => {
  it('create an genre with every field', () => {
    cy.visit('/')
    cy.contains('Administración').click();
    cy.contains('Géneros').click();
    cy.get('#type').type(getRandomString());
    cy.wait(3000);
    cy.contains('Guardar').click();
    cy.get('.toast-success').should('be.visible');
  })
})

function getRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



