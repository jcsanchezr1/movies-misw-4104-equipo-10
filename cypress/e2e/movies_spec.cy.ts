describe('Movies e2e Tests', () => {
  it('Visits and validates the initial project page of movie list', () => {
    cy.visit('/')
    cy.url().should('include', '/')
    cy.get('.col h1').should('contain', 'Películas')
    cy.get('.card').should('have.length.at.least', 1)
    cy.get('.search-input').type('Stranger in Town, A')
    cy.get('.card').should('have.length', 1)
  })

  it('Visits and validates the page of movie detail', () => {
    cy.visit('/')
    cy.url().should('include', '/')
    cy.get('.col h1').should('contain', 'Películas')
    cy.get('.card').should('have.length.at.least', 1)
    cy.get('.search-input').type('Stranger in Town, A')
    cy.get('.card').should('have.length', 1)
    cy.get('.card').click()
    cy.get('.thumb img').should('exist')
    cy.contains('.movie-name', 'Stranger in Town, A')
  })

  it('Visits and validates the page of movie detail and create a review', () => {
    cy.visit('/')
    cy.url().should('include', '/')
    cy.get('.col h1').should('contain', 'Películas')
    cy.get('.card').should('have.length.at.least', 1)
    cy.get('.search-input').type('Stranger in Town, A')
    cy.get('.card').should('have.length', 1)
    cy.get('.card').click()
    cy.get('.thumb img').should('exist')
    cy.contains('.movie-name', 'Stranger in Town, A')
    cy.get('.btn-custom').click()
    cy.get('#creator').type('User')
    cy.get('#score').select('3')
    cy.get('#text').type('Is a good movie!')
    cy.contains('.btn-custom', 'Guardar').click()
    cy.get('.toast-success').should('be.visible')
    cy.get('.toast-success').click()
    cy.get('#creator').should('not.exist')
    cy.get('#text').should('not.exist')
  })

  it('create a movie with every field', () => {
    cy.visit('/')
    cy.contains('Administración').click();
    cy.contains('Crear película').click();
    cy.get('#titulo').type(getTitleString());
    cy.get('#duracion').type("5");
    cy.get('#duracion').type("5");
    cy.get('#fecha_lanzamiento').type('2024-05-02', { force: true });
    cy.get('#genero').find('option').not(':disabled').eq(0).then(option => {
      const value = option.val();
      if (value) {
        cy.get('#genero').select(value.toString(), { force: true });
      }
    });
    cy.get('#trailer').type("https://www.google.com");
    cy.get('#poster').type("https://www.google.com");
    cy.get('#pais').type("Colombia");
    cy.get('#popularidad').select("5");
    cy.get('#director').select("42a7f5a0-775b-464a-a594-c828fde6b044");
    cy.wait(3000);
    cy.contains('Guardar').click();
    cy.get('.toast-success').should('be.visible');
  })
})

function getTitleString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
