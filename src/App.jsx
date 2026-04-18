import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './App.css'

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
  const [success, setSuccess] = useState(false)

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
    if (!error) {
      setBrandName('')
      setClothingType('')
      setSize('')
      setDiscount('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      await fetchBrands()
    }
    setLoading(false)
  }

  const sizeOptions = clothingType ? getSizes(clothingType) : []
  const isFormValid = brandName && clothingType && size && discount && email

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-icon">◈</span>
            <span className="brand-name">Style Alert</span>
          </div>
          <p className="brand-tagline">Sale notifications for what you actually want</p>
        </div>
      </header>

      <main className="main">
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Set a sale alert</h2>
            <p className="card-subtitle">We'll notify you the moment a match drops in price.</p>
          </div>

          <div className="form">
            <div className="field">
              <label className="label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="brand">Brand</label>
              <input
                id="brand"
                type="text"
                className="input"
                placeholder="e.g. Nike, Zara, Arket"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label className="label" htmlFor="type">Type</label>
                <select
                  id="type"
                  className="input select"
                  value={clothingType}
                  onChange={e => setClothingType(e.target.value)}
                >
                  <option value="">Select type</option>
                  {CLOTHING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="field">
                <label className="label" htmlFor="size">Size</label>
                <select
                  id="size"
                  className={`input select${!clothingType ? ' disabled' : ''}`}
                  value={size}
                  onChange={e => setSize(e.target.value)}
                  disabled={!clothingType}
                >
                  <option value="">Select size</option>
                  {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="discount">Minimum discount</label>
              <div className="input-affix-wrap">
                <input
                  id="discount"
                  type="number"
                  className="input input-affix"
                  placeholder="20"
                  min="1"
                  max="99"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                />
                <span className="affix">% off</span>
              </div>
            </div>

            <button
              className={`btn-primary${!isFormValid || loading ? ' btn-disabled' : ''}${success ? ' btn-success' : ''}`}
              onClick={addBrand}
              disabled={loading || !isFormValid}
            >
              {success ? '✓ Alert added' : loading ? 'Adding…' : 'Add alert'}
            </button>
          </div>
        </section>

        {brands.length > 0 && (
          <section className="watchlist">
            <h3 className="watchlist-title">Your active alerts</h3>
            <ul className="watchlist-list">
              {brands.map((b) => (
                <li key={b.id} className="watchlist-item">
                  <div className="watchlist-main">
                    <span className="watchlist-brand">{b.brand_name}</span>
                    <span className="watchlist-details">{b.clothing_type} · Size {b.size}</span>
                  </div>
                  <span className="watchlist-badge">{b.min_discount}% off</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Style Alert · Netherlands · Deals straight to your inbox</p>
      </footer>
    </div>
  )
}

export default App
