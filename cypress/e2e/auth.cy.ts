describe('Autenticação', () => {
  beforeEach(() => {
    cy.visit('/auth/login');
  });

  it('deve exibir mensagem de erro para credenciais inválidas', () => {
    cy.get('[data-testid="email-input"]').type('usuario@teste.com');
    cy.get('[data-testid="password-input"]').type('senhaerrada');
    cy.get('[data-testid="login-button"]').click();
    
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Credenciais inválidas');
  });

  it('deve redirecionar para dashboard após login bem-sucedido', () => {
    cy.get('[data-testid="email-input"]').type('usuario@teste.com');
    cy.get('[data-testid="password-input"]').type('senha123');
    cy.get('[data-testid="login-button"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });

  it('deve manter usuário logado após refresh', () => {
    cy.login('usuario@teste.com', 'senha123');
    cy.reload();
    cy.url().should('include', '/dashboard');
  });
}); 