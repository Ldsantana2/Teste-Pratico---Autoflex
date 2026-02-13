import { configureStore, createSlice } from '@reduxjs/toolkit'

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
        rawMaterials: [],
        products: [],
    },
    reducers: {
        setMaterials: (state, action) => {
            state.rawMaterials = action.payload
        },
        setProducts: (state, action) => {
            state.products = action.payload
        },
    },
})

export const { setMaterials, setProducts } = inventorySlice.actions

export const store = configureStore({
    reducer: {
        inventory: inventorySlice.reducer,
    },
})

export const calculateOptimizedProduction = (products, rawMaterials) => {
    let tempStock = {}
    rawMaterials.forEach((m) => {
        tempStock[m.id] = m.stockQuantity
    })

    const sortedByPrice = [...products].sort((a, b) => b.price - a.price)

    const productionPlan = []
    let totalRevenue = 0

    sortedByPrice.forEach((product) => {
        let unitsProduced = 0
        let canProduceMore = true

        while (canProduceMore) {
            const hasEnoughInsumos = product.materials?.every((pm) => {
                const available = tempStock[pm.rawMaterial.id] || 0
                return available >= pm.requiredQuantity
            })

            if (hasEnoughInsumos && product.materials?.length > 0) {
                product.materials.forEach((pm) => {
                    tempStock[pm.rawMaterial.id] -= pm.requiredQuantity
                })
                unitsProduced++
            } else {
                canProduceMore = false
            }
        }

        productionPlan.push({
            ...product,
            suggestedQuantity: unitsProduced,
        })
        totalRevenue += unitsProduced * product.price
    })

    return { productionPlan, totalRevenue }
}
