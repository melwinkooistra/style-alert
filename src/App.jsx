import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const CLOTHING_TYPES = [
  'T-shirt', 'Shirt', 'Sweater', 'Hoodie', 'Jacket', 'Coat',
  'Jeans', 'Trousers', 'Shorts', 'Dress', 'Skirt', 'Shoes', 'Sneakers',
]

const SIZES = {
  tops: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  bottoms: ['28', '29', '30', '31', '32', '33', '34', '36', '38', '40'],
  shoes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
}

const bottomTypes = ['Jeans', 'Trousers', 'Shorts', 'Skirt']
const shoeTypes = ['Shoes', 'Sneakers']

function getSizes(clothingType) {
  if (shoeTypes.includes(clothingType)) return SIZES.shoes
  if (bottomTypes.includes(clothingType)) return SIZES.bottoms
  return SIZES.tops
}

function App() {
  const [brands, setBrands] = useState([])
  const [brandName, setBrandName] = useState('')
  const [clothingType, setClothingType] = useState('')
  const [size, setSize] = useState('')
  const [discount, setDiscount] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBrands()
  }, [])

  useEffect(() => {
    setSize('')
  }, [clothingType])

  const fetchBrands = async () => {
    const { data } = await supabase.from('brands').select('*')
    if (data) setBrands(data)
  }

  const addBrand = async () => {
    if (!brandName || !clothingType || !size || !discount || !email) return
    setLoading(true)
    const { error } = await supabase.from('brands').insert({
      email,
      brand_name: brandName,
      clothing_type: clothingType,
      size,
      min_discount: parseInt(discount),
    })
    if (error) console.log('Error:', error.message)
    setBrandName('')
    setClothingType('')
    setSize('')
    setDiscount('')
    await fetchBrands()
    setLoading(false)
  }

  const sizeOptions = clothingType ? getSizes(clothingType) : []
  const isFormValid = brandName && clothingType && size && discount && email

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Style Alert</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>Get notified when your favourite items go on sale.</p>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Your email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Add a watchlist item</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="text"
            placeholder="Brand name"
            value={brandName}
            onChange={e => setBrandName(e.target.value)}
            style={{ flex: 2, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            type="number"
            placeholder="Min % off"
            value={discount}
            onChange={e => setDiscount(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={clothingType}
            onChange={e => setClothingType(e.target.value)}
            style={{ flex: 2, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff' }}
          >
            <option value="">Clothing type</option>
            {CLOTHING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={size}
            onChange={e => setSize(e.target.value)}
            disabled={!clothingType}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', opacity: clothingType ? 1 : 0.5 }}
          >
            <option value="">Size</option>
            {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={addBrand}
            disabled={loading || !isFormValid}
            style={{ padding: '10px 16px', borderRadius: '6px', background: isFormValid ? '#000' : '#999', color: '#fff', border: 'none', cursor: isFormValid ? 'pointer' : 'default' }}
          >
            {loading ? '...' : 'Add'}
          </button>
        </div>
      </div>

      {brands.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '12px' }}>Your watchlist</h2>
          {brands.map((b) => (
            <div key={b.id} style={{ padding: '12px', background: '#f5f5f5', borderRadius: '6px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>{b.brand_name}</span>
                <span style={{ color: '#666' }}>{b.min_discount}% off</span>
              </div>
              <div style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>
                {b.clothing_type} — Size {b.size}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
