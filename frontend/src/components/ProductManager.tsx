import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import { useConfirm } from '../contexts/ConfirmContext'
import axios from 'axios'
import styles from '../styles/ProductManager.module.css'

interface Product {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  category: string
  image_url?: string
}

interface ProductManagerProps {
  products: Product[]
  onProductsChange: () => void
}

export default function ProductManager({ products, onProductsChange }: ProductManagerProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image_url: ''
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const { addToast } = useToast()
  const { confirm } = useConfirm()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      image_url: formData.image_url
    }

    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, productData)
      } else {
        await axios.post('/api/products', productData)
      }

      setFormData({ name: '', description: '', price: '', stock: '', category: '', image_url: '' })
      setEditingId(null)
      onProductsChange()
      addToast(editingId ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!', 'success')
    } catch (error) {
      console.error('Error:', error)
      addToast('Terjadi kesalahan saat menyimpan produk', 'error')
    }
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      image_url: product.image_url || ''
    })
    setEditingId(product.id)
  }

  const handleDelete = async (id: number) => {
    confirm({
      title: 'Hapus Produk',
      message: 'Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.',
      confirmText: 'Hapus',
      cancelText: 'Batal',
      onConfirm: async () => {
        try {
          await axios.delete(`/api/products/${id}`)
          onProductsChange()
          addToast('Produk berhasil dihapus!', 'success')
        } catch (error: any) {
          console.error('Error:', error)
          if (error.response?.status === 403) {
            addToast('Akses ditolak! Hanya admin yang dapat menghapus produk.', 'error')
          } else if (error.response?.status === 401) {
            addToast('Sesi Anda telah berakhir. Silakan login ulang.', 'error')
          } else {
            addToast('Terjadi kesalahan saat menghapus produk: ' + (error.response?.data?.error || error.message), 'error')
          }
        }
      }
    })
  }

  const cancelEdit = () => {
    setFormData({ name: '', description: '', price: '', stock: '', category: '', image_url: '' })
    setEditingId(null)
  }

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h2>{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nama Produk:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Deskripsi:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={styles.input}
              rows={3}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Kategori:</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g. Electronics, Fashion, Books"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Harga:</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Stok:</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>URL Gambar:</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className={styles.input}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>
              {editingId ? 'Perbarui' : 'Tambah'} Produk
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className={styles.cancelButton}>
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.listSection}>
        <h2>Daftar Produk</h2>
        <div className={styles.productList}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p><strong>Kategori:</strong> {product.category}</p>
                <p><strong>Harga:</strong> Rp {product.price.toLocaleString()}</p>
                <p><strong>Stok:</strong> {product.stock}</p>
              </div>
              <div className={styles.productActions}>
                <button
                  onClick={() => handleEdit(product)}
                  className={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className={styles.deleteButton}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}