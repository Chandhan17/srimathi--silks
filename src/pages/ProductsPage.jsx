import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FiltersBar from '../components/FiltersBar'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ProductGrid from '../components/ProductGrid'
import QuickShopModal from '../components/QuickShopModal'
import SectionReveal from '../components/SectionReveal'
import { useProducts } from '../hooks/useProducts'

const initialFilters = {
  search: '',
  fabric: '',
  sizeLength: '',
  minPrice: '',
  maxPrice: '',
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryFromParams = searchParams.get('category') || ''
  const [filters, setFilters] = useState(initialFilters)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { products, loading, error } = useProducts()

  const sizeOptions = useMemo(
    () =>
      [...new Set(products.map((product) => String(product.sizeLength || '').trim()).filter(Boolean))].sort(),
    [products]
  )

  const filteredProducts = useMemo(() => {
    const minPrice = Number(filters.minPrice || 0)
    const maxPrice = Number(filters.maxPrice || Number.POSITIVE_INFINITY)
    const query = filters.search.trim().toLowerCase()

    return products.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(query)
      const categoryMatch = !categoryFromParams || product.category === categoryFromParams
      const fabricMatch = !filters.fabric || product.fabric === filters.fabric
      const sizeMatch = !filters.sizeLength || product.sizeLength === filters.sizeLength
      const price = Number(product.price || 0)
      const priceMatch = price >= minPrice && price <= maxPrice
      return nameMatch && categoryMatch && fabricMatch && sizeMatch && priceMatch
    })
  }, [products, filters, categoryFromParams])

  const updateFilter = (field, value) => {
    if (field === 'category') {
      const nextParams = new URLSearchParams(searchParams)
      if (value) {
        nextParams.set('category', value)
      } else {
        nextParams.delete('category')
      }
      setSearchParams(nextParams)
      return
    }

    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const clearFilters = () => {
    setFilters(initialFilters)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('category')
      return next
    })
  }

  const composedFilters = { ...filters, category: categoryFromParams }

  return (
    <div className="space-y-6">
      <SectionReveal>
        <div>
          <p className="section-kicker">All Products</p>
          <h1 className="section-title">Explore Our Saree Gallery</h1>
        </div>
      </SectionReveal>

      <FiltersBar
        filters={composedFilters}
        onChange={updateFilter}
        onClear={clearFilters}
        sizeOptions={sizeOptions}
      />

      {error && <p className="text-sm text-red-700">{error}</p>}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <ProductGrid products={filteredProducts} onQuickShop={setSelectedProduct} />
      )}

      <QuickShopModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
