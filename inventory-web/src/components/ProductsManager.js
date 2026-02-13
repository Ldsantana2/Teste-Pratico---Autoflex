import React from 'react'

const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

const ProductsManager = ({
    products,
    rawMaterials,
    newProduct,
    setNewProduct,
    handleSave,
    startEdit,
    handleDelete,
    editingId,
    setEditingId,
    styles,
}) => {
    return (
        <div style={styles.uniformWidthWrapper}>
            <h2 style={styles.titleStyle}>
                {editingId ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <div style={styles.formCardStyle}>
                <div style={styles.fieldStyle}>
                    <label>
                        <strong>Nome:</strong>
                    </label>
                    <input
                        style={styles.inputStyle}
                        value={newProduct.name}
                        onChange={(e) =>
                            setNewProduct({
                                ...newProduct,
                                name: e.target.value,
                            })
                        }
                    />
                </div>
                <div style={styles.fieldStyle}>
                    <label>
                        <strong>Preço:</strong>
                    </label>
                    <input
                        style={styles.inputStyle}
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

                <div style={styles.compositionBoxStyle}>
                    <h4 style={{ marginTop: '5px', marginBottom: '15px' }}>
                        Composição (Insumos Necessários)
                    </h4>
                    {rawMaterials.map((rm) => (
                        <div key={rm.id} style={styles.compositionRowStyle}>
                            <span style={{ flex: 1 }}>{rm.name}:</span>
                            <input
                                type="number"
                                placeholder="Qtd"
                                style={styles.compositionInputStyle}
                                value={
                                    newProduct.materials.find(
                                        (x) => x.rawMaterial.id === rm.id,
                                    )?.requiredQuantity || ''
                                }
                                onChange={(e) => {
                                    const val = e.target.value
                                    let mats = [...newProduct.materials]
                                    const idx = mats.findIndex(
                                        (x) => x.rawMaterial.id === rm.id,
                                    )
                                    if (val && parseFloat(val) > 0) {
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
                                    } else if (idx > -1) mats.splice(idx, 1)
                                    setNewProduct({
                                        ...newProduct,
                                        materials: mats,
                                    })
                                }}
                            />
                        </div>
                    ))}
                </div>
                <button onClick={handleSave} style={styles.saveBtnStyle}>
                    {editingId ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
                {editingId && (
                    <button
                        onClick={() => {
                            setEditingId(null)
                            setNewProduct({ name: '', price: 0, materials: [] })
                        }}
                        style={styles.cancelBtnStyle}
                    >
                        Cancelar
                    </button>
                )}
            </div>

            <table style={styles.tableStyle}>
                <thead>
                    <tr style={styles.thGroupStyle}>
                        <th style={styles.thStyle}>Nome</th>
                        <th style={styles.thStyle}>Preço</th>
                        <th style={styles.thStyle}>Insumos</th>
                        <th style={styles.thStyle}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id} style={styles.trStyle}>
                            <td style={styles.tdStyle}>{p.name}</td>
                            <td style={styles.tdStyle}>
                                {formatter.format(p.price || 0)}
                            </td>
                            <td style={styles.tdStyle}>
                                <small>
                                    {p.materials
                                        ?.map(
                                            (m) =>
                                                `${m.rawMaterial.name} (${m.requiredQuantity})`,
                                        )
                                        .join(', ') || 'Nenhum'}
                                </small>
                            </td>
                            <td style={styles.tdStyle}>
                                <button onClick={() => startEdit(p)}>
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    style={{ marginLeft: '10px', color: 'red' }}
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ProductsManager
