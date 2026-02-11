export const calculateAvailableQty = (product, rawMaterials) => {
    if (!product.materials || product.materials.length === 0) return 0

    let minPossible = Infinity

    product.materials.forEach((pm) => {
        const materialInStock = rawMaterials.find(
            (rm) => rm.id === pm.rawMaterial.id,
        )

        const stockAvailable = materialInStock
            ? materialInStock.stockQuantity
            : 0
        const required = pm.requiredQuantity || 1

        const possibleUnits = Math.floor(stockAvailable / required)

        if (possibleUnits < minPossible) {
            minPossible = possibleUnits
        }
    })

    return minPossible === Infinity ? 0 : minPossible
}
