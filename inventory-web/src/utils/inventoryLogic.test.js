import { calculateAvailableQty } from './inventoryLogic'

describe('Testes de Logística Autoflex', () => {
    test('Deve calcular corretamente baseada no material limitante', () => {
        const product = {
            materials: [
                { rawMaterial: { id: 1 }, requiredQuantity: 5 },
                { rawMaterial: { id: 2 }, requiredQuantity: 2 },
            ],
        }
        const stock = [
            { id: 1, stockQuantity: 50 },
            { id: 2, stockQuantity: 4 },
        ]
        expect(calculateAvailableQty(product, stock)).toBe(2)
    })

    test('Deve retornar 0 se o material não existir no estoque', () => {
        const product = {
            materials: [{ rawMaterial: { id: 99 }, requiredQuantity: 1 }],
        }
        expect(calculateAvailableQty(product, [])).toBe(0)
    })
})
