import React from 'react'

const MaterialsManager = ({
    rawMaterials,
    newMaterial,
    setNewMaterial,
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
                {editingId ? 'Editar Insumo' : 'Novo Insumo'}
            </h2>
            <div style={styles.formCardStyle}>
                <div style={styles.fieldStyle}>
                    <label>
                        <strong>Nome:</strong>
                    </label>
                    <input
                        style={styles.inputStyle}
                        value={newMaterial.name}
                        onChange={(e) =>
                            setNewMaterial({
                                ...newMaterial,
                                name: e.target.value,
                            })
                        }
                    />
                </div>
                <div style={styles.fieldStyle}>
                    <label>
                        <strong>Estoque:</strong>
                    </label>
                    <input
                        style={styles.inputStyle}
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
                <button onClick={handleSave} style={styles.saveBtnStyle}>
                    {editingId ? 'Atualizar' : 'Salvar Insumo'}
                </button>
                {editingId && (
                    <button
                        onClick={() => {
                            setEditingId(null)
                            setNewMaterial({ name: '', stockQuantity: 0 })
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
                        <th style={styles.thStyle}>Estoque</th>
                        <th style={styles.thStyle}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {rawMaterials.map((m) => (
                        <tr key={m.id} style={styles.trStyle}>
                            <td style={styles.tdStyle}>{m.name}</td>
                            <td style={styles.tdStyle}>{m.stockQuantity}</td>
                            <td style={styles.tdStyle}>
                                <button onClick={() => startEdit(m)}>
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(m.id)}
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

export default MaterialsManager
