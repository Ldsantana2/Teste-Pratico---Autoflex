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
