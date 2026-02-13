import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { setMaterials, setProducts } from './store'
import ProductionDashboard from './components/ProductionDashboard'
import MaterialsManager from './components/MaterialsManager'
import ProductsManager from './components/ProductsManager'

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api'

function App() {
    const dispatch = useDispatch()
    const { rawMaterials, products } = useSelector((state) => state.inventory)
    const [tab, setTab] = useState('production')
    const [editingId, setEditingId] = useState(null)

    const [productionData, setProductionData] = useState({
        productionPlan: [],
        totalRevenue: 0,
    })
    const [newMaterial, setNewMaterial] = useState({
        name: '',
        stockQuantity: 0,
    })
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        materials: [],
    })

    const refreshData = useCallback(async () => {
        try {
            const [resM, resP, resSug] = await Promise.all([
                axios.get(`${API_BASE}/materials`),
                axios.get(`${API_BASE}/products`),
                axios.get(`${API_BASE}/production/suggested`),
            ])
            dispatch(setMaterials(resM.data.sort((a, b) => a.id - b.id)))
            dispatch(setProducts(resP.data.sort((a, b) => a.id - b.id)))
            setProductionData(resSug.data)
        } catch (error) {
            console.error('Erro ao carregar dados:', error)
        }
    }, [dispatch])

    useEffect(() => {
        refreshData()
    }, [refreshData])

    const handleSaveMaterial = async () => {
        const payload = {
            ...newMaterial,
            stockQuantity: parseFloat(newMaterial.stockQuantity),
        }
        if (editingId)
            await axios.put(`${API_BASE}/materials/${editingId}`, payload)
        else await axios.post(`${API_BASE}/materials`, payload)
        setNewMaterial({ name: '', stockQuantity: 0 })
        setEditingId(null)
        refreshData()
    }

    const handleSaveProduct = async () => {
        const payload = {
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            materials: newProduct.materials.map((m) => ({
                rawMaterial: { id: m.rawMaterial.id },
                requiredQuantity: parseFloat(m.requiredQuantity),
            })),
        }
        if (editingId)
            await axios.put(`${API_BASE}/products/${editingId}`, payload)
        else await axios.post(`${API_BASE}/products`, payload)
        setNewProduct({ name: '', price: 0, materials: [] })
        setEditingId(null)
        refreshData()
    }

    const startEditMaterial = (m) => {
        setEditingId(m.id)
        setNewMaterial({ name: m.name, stockQuantity: m.stockQuantity })
        setTab('materials')
    }
    const startEditProduct = (p) => {
        setEditingId(p.id)
        setNewProduct({
            name: p.name,
            price: p.price,
            materials: [...p.materials],
        })
        setTab('products')
    }

    return (
        <div className="container" style={styles.containerStyle}>
            <nav style={styles.navStyle}>
                <button
                    onClick={() => {
                        setTab('production')
                        setEditingId(null)
                    }}
                    style={styles.btnStyle(tab === 'production')}
                >
                    Capacidade
                </button>
                <button
                    onClick={() => {
                        setTab('materials')
                        setEditingId(null)
                    }}
                    style={styles.btnStyle(tab === 'materials')}
                >
                    Insumos
                </button>
                <button
                    onClick={() => {
                        setTab('products')
                        setEditingId(null)
                    }}
                    style={styles.btnStyle(tab === 'products')}
                >
                    Produtos
                </button>
            </nav>

            <div style={styles.mainContentStyle}>
                {tab === 'production' && (
                    <ProductionDashboard
                        productionData={productionData}
                        styles={styles}
                    />
                )}
                {tab === 'materials' && (
                    <MaterialsManager
                        rawMaterials={rawMaterials}
                        newMaterial={newMaterial}
                        setNewMaterial={setNewMaterial}
                        handleSave={handleSaveMaterial}
                        startEdit={startEditMaterial}
                        handleDelete={(id) =>
                            axios
                                .delete(`${API_BASE}/materials/${id}`)
                                .then(refreshData)
                        }
                        editingId={editingId}
                        setEditingId={setEditingId}
                        styles={styles}
                    />
                )}
                {tab === 'products' && (
                    <ProductsManager
                        products={products}
                        rawMaterials={rawMaterials}
                        newProduct={newProduct}
                        setNewProduct={setNewProduct}
                        handleSave={handleSaveProduct}
                        startEdit={startEditProduct}
                        handleDelete={(id) =>
                            axios
                                .delete(`${API_BASE}/products/${id}`)
                                .then(refreshData)
                        }
                        editingId={editingId}
                        setEditingId={setEditingId}
                        styles={styles}
                    />
                )}
            </div>
        </div>
    )
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
    },
    navStyle: {
        display: 'flex',
        width: '100%',
        maxWidth: '1000px',
        justifyContent: 'center',
        borderBottom: '2px solid #001f3f',
        marginBottom: '40px',
    },
    mainContentStyle: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    titleStyle: { color: '#001f3f', marginBottom: '25px', textAlign: 'center' },
    uniformWidthWrapper: {
        width: '100%',
        maxWidth: '1000px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    formCardStyle: {
        background: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '800px',
        marginBottom: '30px',
        boxSizing: 'border-box',
    },
    tableStyle: {
        width: '100%',
        borderCollapse: 'collapse',
        background: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    inputStyle: {
        width: '100%',
        padding: '12px',
        marginTop: '5px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
    },
    fieldStyle: { marginBottom: '20px', width: '100%', textAlign: 'left' },
    btnStyle: (active) => ({
        padding: '12px 24px',
        background: active ? '#001f3f' : '#e0e0e0',
        color: active ? '#fff' : '#001f3f',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        borderRadius: '8px 8px 0 0',
        marginRight: '2px',
    }),
    saveBtnStyle: {
        padding: '15px 30px',
        background: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        width: '100%',
    },
    cancelBtnStyle: {
        padding: '15px 30px',
        background: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        width: '100%',
        marginTop: '10px',
    },
    cardGridStyle: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        width: '100%',
    },
    cardStyle: {
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: '1px solid #eee',
    },
    cardHeaderStyle: {
        background: '#001f3f',
        color: '#fff',
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    cardBodyStyle: { padding: '20px' },
    infoRowStyle: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
    },
    badgeStyle: (isAlert) => ({
        background: isAlert ? '#dc3545' : '#28a745',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
    }),
    compositionBoxStyle: {
        background: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        margin: '15px 0',
        textAlign: 'left',
        width: '100%',
        boxSizing: 'border-box',
    },
    compositionRowStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        width: '100%',
    },
    compositionInputStyle: {
        width: '80px',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        textAlign: 'right',
    },
    thGroupStyle: { background: '#001f3f', color: '#fff' },
    thStyle: { padding: '15px', textAlign: 'left' },
    tdStyle: { padding: '15px' },
    trStyle: { borderBottom: '1px solid #ddd' },
    summaryCardStyle: {
        background: '#001f3f',
        color: '#fff',
        padding: '30px',
        borderRadius: '12px',
        width: '100%',
        textAlign: 'center',
        marginBottom: '30px',
        boxShadow: '0 8px 16px rgba(0,31,63,0.2)',
    },
}

export default App
