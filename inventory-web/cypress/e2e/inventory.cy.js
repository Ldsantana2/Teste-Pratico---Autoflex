describe('E2E Autoflex', () => {
    it('Deve navegar para materiais e adicionar novo plástico', () => {
        cy.visit('/')

        cy.contains('button', 'Insumos').click()

        cy.get('input').first().type('Plástico Teste')

        cy.get('input').eq(1).type('150')

        cy.contains('button', 'Salvar Insumo').click()

        cy.contains('table', 'Plástico Teste').should('be.visible')
        cy.contains('table', '150').should('be.visible')
    })
})
