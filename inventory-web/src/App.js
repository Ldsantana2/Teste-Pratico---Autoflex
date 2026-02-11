import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { setMaterials, setProducts } from './store'

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api'

function App() {
    const dispatch = useDispatch()
    const { rawMaterials, products } = useSelector((state) => state.inventory)
    const [tab, setTab] = useState('production')

    const [editingId, setEditingId] = useState(null)
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
            const resM = await axios.get(`${API_BASE}/materials`)
            const resP = await axios.get(`${API_BASE}/products`)

            const sortedMaterials = resM.data.sort((a, b) => a.id - b.id)
            const sortedProducts = resP.data.sort((a, b) => a.id - b.id)

            dispatch(setMaterials(sortedMaterials))
            dispatch(setProducts(sortedProducts))
        } catch (error) {
            console.error('Erro ao carregar dados:', error)
        }
    }, [dispatch])

    useEffect(() => {
        refreshData()
    }, [refreshData])

    const calculateAvailableQty = (product) => {
        if (!product.materials || product.materials.length === 0) return 0
        let minPossible = Infinity
        product.materials.forEach((pm) => {
            const materialInStock = rawMaterials.find(
                (rm) => rm.id === pm.rawMaterial.id,
            )
            const stock = materialInStock ? materialInStock.stockQuantity : 0
            const possible = Math.floor(stock / pm.requiredQuantity)
            if (possible < minPossible) minPossible = possible
        })
        return minPossible === Infinity ? 0 : minPossible
    }

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

    const startEditMaterial = (m) => {
        setEditingId(m.id)
        setNewMaterial({ name: m.name, stockQuantity: m.stockQuantity })
        setTab('materials')
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
        <div className="container" style={containerStyle}>
            <nav style={navStyle}>
                <button
                    onClick={() => {
                        setTab('production')
                        setEditingId(null)
                    }}
                    style={btnStyle(tab === 'production')}
                >
                    Capacidade
                </button>
                <button
                    onClick={() => {
                        setTab('materials')
                        setEditingId(null)
                    }}
                    style={btnStyle(tab === 'materials')}
                >
                    Insumos
                </button>
                <button
                    onClick={() => {
                        setTab('products')
                        setEditingId(null)
                    }}
                    style={btnStyle(tab === 'products')}
                >
                    Produtos
                </button>
            </nav>

            <div style={mainContentStyle}>
                {tab === 'production' && (
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '1000px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <h2 style={titleStyle}>Dashboard de Produção</h2>
                        <div style={cardGridStyle}>
                            {products.map((p) => {
                                const qty = calculateAvailableQty(p)
                                return (
                                    <div key={p.id} style={cardStyle}>
                                        <div style={cardHeaderStyle}>
                                            <h3 style={{ margin: 0 }}>
                                                {p.name}
                                            </h3>
                                            <span style={badgeStyle(qty === 0)}>
                                                {qty === 0
                                                    ? 'Sem Insumos'
                                                    : 'Ativo'}
                                            </span>
                                        </div>
                                        <div style={cardBodyStyle}>
                                            <div style={infoRowStyle}>
                                                <span>Capacidade:</span>
                                                <strong
                                                    style={{
                                                        color:
                                                            qty <= 5
                                                                ? '#dc3545'
                                                                : '#001f3f',
                                                    }}
                                                >
                                                    {qty} unidades
                                                </strong>
                                            </div>
                                            <div style={infoRowStyle}>
                                                <span>Preço:</span>
                                                <span>
                                                    R$ {p.price.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {tab === 'materials' && (
                    <div style={uniformWidthWrapper}>
                        <h2 style={titleStyle}>
                            {editingId ? 'Editar Insumo' : 'Novo Insumo'}
                        </h2>

                        <div style={formCardStyle}>
                            <div style={fieldStyle}>
                                <label>
                                    <strong>Nome:</strong>
                                </label>
                                <input
                                    style={inputStyle}
                                    value={newMaterial.name}
                                    onChange={(e) =>
                                        setNewMaterial({
                                            ...newMaterial,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div style={fieldStyle}>
                                <label>
                                    <strong>Estoque:</strong>
                                </label>
                                <input
                                    style={inputStyle}
                                    type="number"
                                    value={newMaterial.stockQuantity}
                                    onChange={(e) =>
                                        setNewMaterial({
                                            ...newMaterial,
                                            stockQuantity: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <button
                                onClick={handleSaveMaterial}
                                style={saveBtnStyle}
                            >
                                {editingId ? 'Atualizar' : 'Salvar Insumo'}
                            </button>
                            {editingId && (
                                <button
                                    onClick={() => {
                                        setEditingId(null)
                                        setNewMaterial({
                                            name: '',
                                            stockQuantity: 0,
                                        })
                                    }}
                                    style={cancelBtnStyle}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>

                        <table style={tableStyle}>
                            <thead>
                                <tr style={thGroupStyle}>
                                    <th style={thStyle}>Nome</th>
                                    <th style={thStyle}>Estoque</th>
                                    <th style={thStyle}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rawMaterials.map((m) => (
                                    <tr key={m.id} style={trStyle}>
                                        <td style={tdStyle}>{m.name}</td>
                                        <td style={tdStyle}>
                                            {m.stockQuantity}
                                        </td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() =>
                                                    startEditMaterial(m)
                                                }
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    axios
                                                        .delete(
                                                            `${API_BASE}/materials/${m.id}`,
                                                        )
                                                        .then(refreshData)
                                                }
                                                style={{
                                                    marginLeft: '10px',
                                                    color: 'red',
                                                }}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'products' && (
                    <div style={uniformWidthWrapper}>
                        <h2 style={titleStyle}>
                            {editingId ? 'Editar Produto' : 'Novo Produto'}
                        </h2>

                        <div style={formCardStyle}>
                            <div style={fieldStyle}>
                                <label>
                                    <strong>Nome:</strong>
                                </label>
                                <input
                                    style={inputStyle}
                                    value={newProduct.name}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div style={fieldStyle}>
                                <label>
                                    <strong>Preço:</strong>
                                </label>
                                <input
                                    style={inputStyle}
                                    type="number"
                                    value={newProduct.price}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            price: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div style={compositionBoxStyle}>
                                <h4 style={{ marginTop: '5px' }}>Composição</h4>
                                {rawMaterials.map((rm) => (
                                    <div
                                        key={rm.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        <span>{rm.name}:</span>
                                        <input
                                            type="number"
                                            placeholder="Qtd"
                                            style={{ width: '60px' }}
                                            value={
                                                newProduct.materials.find(
                                                    (x) =>
                                                        x.rawMaterial.id ===
                                                        rm.id,
                                                )?.requiredQuantity || ''
                                            }
                                            onChange={(e) => {
                                                const val = e.target.value
                                                let mats = [
                                                    ...newProduct.materials,
                                                ]
                                                const idx = mats.findIndex(
                                                    (x) =>
                                                        x.rawMaterial.id ===
                                                        rm.id,
                                                )
                                                if (
                                                    val &&
                                                    parseFloat(val) > 0
                                                ) {
                                                    if (idx > -1)
                                                        mats[idx] = {
                                                            ...mats[idx],
                                                            requiredQuantity:
                                                                parseFloat(val),
                                                        }
                                                    else
                                                        mats.push({
                                                            rawMaterial: {
                                                                id: rm.id,
                                                                name: rm.name,
                                                            },
                                                            requiredQuantity:
                                                                parseFloat(val),
                                                        })
                                                } else if (idx > -1)
                                                    mats.splice(idx, 1)
                                                setNewProduct({
                                                    ...newProduct,
                                                    materials: mats,
                                                })
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleSaveProduct}
                                style={saveBtnStyle}
                            >
                                {editingId
                                    ? 'Salvar Alterações'
                                    : 'Cadastrar Produto'}
                            </button>
                            {editingId && (
                                <button
                                    onClick={() => {
                                        setEditingId(null)
                                        setNewProduct({
                                            name: '',
                                            price: 0,
                                            materials: [],
                                        })
                                    }}
                                    style={cancelBtnStyle}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>

                        <table style={tableStyle}>
                            <thead>
                                <tr style={thGroupStyle}>
                                    <th style={thStyle}>Nome</th>
                                    <th style={thStyle}>Preço</th>
                                    <th style={thStyle}>Insumos</th>
                                    <th style={thStyle}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.id} style={trStyle}>
                                        <td style={tdStyle}>{p.name}</td>
                                        <td style={tdStyle}>
                                            R$ {p.price.toFixed(2)}
                                        </td>
                                        <td style={tdStyle}>
                                            <small>
                                                {p.materials
                                                    ?.map(
                                                        (m) =>
                                                            `${m.rawMaterial.name} (${m.requiredQuantity})`,
                                                    )
                                                    .join(', ') || 'Nenhum'}
                                            </small>
                                        </td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() =>
                                                    startEditProduct(p)
                                                }
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    axios
                                                        .delete(
                                                            `${API_BASE}/products/${p.id}`,
                                                        )
                                                        .then(refreshData)
                                                }
                                                style={{
                                                    marginLeft: '10px',
                                                    color: 'red',
                                                }}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
}
const navStyle = {
    display: 'flex',
    width: '100%',
    maxWidth: '1000px',
    justifyContent: 'center',
    borderBottom: '2px solid #001f3f',
    marginBottom: '40px',
}
const mainContentStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}
const titleStyle = {
    color: '#001f3f',
    marginBottom: '25px',
    textAlign: 'center',
}

const uniformWidthWrapper = {
    width: '100%',
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}

const formCardStyle = {
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    width: '100%',
    marginBottom: '30px',
    boxSizing: 'border-box',
}

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}

const inputStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '5px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
}

const fieldStyle = { marginBottom: '20px', width: '100%', textAlign: 'left' }
const btnStyle = (active) => ({
    padding: '12px 24px',
    background: active ? '#001f3f' : '#e0e0e0',
    color: active ? '#fff' : '#001f3f',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: '8px 8px 0 0',
    marginRight: '2px',
})
const saveBtnStyle = {
    padding: '15px 30px',
    background: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
}
const cancelBtnStyle = {
    padding: '15px 30px',
    background: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
    marginTop: '10px',
}

const cardGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    width: '100%',
}
const cardStyle = {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    border: '1px solid #eee',
}
const cardHeaderStyle = {
    background: '#001f3f',
    color: '#fff',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
}
const cardBodyStyle = { padding: '20px' }
const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
}
const badgeStyle = (isAlert) => ({
    background: isAlert ? '#dc3545' : '#28a745',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
})
const compositionBoxStyle = {
    background: '#f9f9f9',
    padding: '5px 15px 15px 15px',
    borderRadius: '8px',
    margin: '15px 0',
    textAlign: 'left',
    width: '50%',
    boxSizing: 'border-box',
}
const thGroupStyle = { background: '#001f3f', color: '#fff' }
const thStyle = { padding: '15px', textAlign: 'left' }
const tdStyle = { padding: '15px' }
const trStyle = { borderBottom: '1px solid #ddd' }

export default App
