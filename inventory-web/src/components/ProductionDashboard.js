import React from 'react'

const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

const ProductionDashboard = ({ productionData, styles }) => {
    const { productionPlan, totalRevenue } = productionData

    return (
        <div style={styles.uniformWidthWrapper}>
            <h2 style={styles.titleStyle}>Dashboard de Produção Otimizada</h2>

            <div style={styles.summaryCardStyle}>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
                    VALOR TOTAL ESTIMADO DA PRODUÇÃO
                </p>
                <h2 style={{ margin: '10px 0', fontSize: '2.5rem' }}>
                    {formatter.format(totalRevenue || 0)}
                </h2>
                <small>
                    Sugestão baseada na priorização de produtos de maior valor
                </small>
            </div>

            <div style={styles.cardGridStyle}>
                {productionPlan.map((p, index) => {
                    const isTopPriority = index === 0 && p.suggestedQuantity > 0
                    return (
                        <div key={p.id} style={styles.cardStyle}>
                            <div style={styles.cardHeaderStyle}>
                                <h3 style={{ margin: 0 }}>{p.name}</h3>
                                {isTopPriority ? (
                                    <span style={styles.badgeStyle(false)}>
                                        Priorizado
                                    </span>
                                ) : p.suggestedQuantity === 0 ? (
                                    <span style={styles.badgeStyle(true)}>
                                        Sem Estoque
                                    </span>
                                ) : null}
                            </div>
                            <div style={styles.cardBodyStyle}>
                                <div style={styles.infoRowStyle}>
                                    <span>Produção Sugerida:</span>
                                    <strong
                                        style={{
                                            color:
                                                p.suggestedQuantity === 0
                                                    ? '#dc3545'
                                                    : '#28a745',
                                        }}
                                    >
                                        {p.suggestedQuantity} unidades
                                    </strong>
                                </div>
                                <div style={styles.infoRowStyle}>
                                    <span>Preço Unitário:</span>
                                    <span>
                                        {formatter.format(p.price || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ProductionDashboard
