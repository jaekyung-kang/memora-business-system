import { useState, useEffect } from 'react'
import { Layout } from '../../components/Layout'
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { api } from '../../services/api'

interface Dictionary {
  id: string
  category: string
  name: string
  value: string
  order: number
  isActive: boolean
}

export function AdminDictionariesPage() {
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([])
  const [filteredDictionaries, setFilteredDictionaries] = useState<Dictionary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Dictionary | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = [
    'SERVICE_TYPE',
    'PLAN_NAME',
    'CONTRACT_PERIOD',
    'AUTH_METHOD',
    'SIM_PURCHASE',
    'BANK_LIST',
  ]

  const [formData, setFormData] = useState({
    category: '',
    name: '',
    value: '',
    order: 0,
  })

  const fetchDictionaries = async () => {
    try {
      const response = await api.get('/dictionaries')
      setDictionaries(response.data)
      setFilteredDictionaries(response.data)
    } catch (error) {
      console.error('Failed to fetch dictionaries:', error)
    }
  }

  useEffect(() => {
    fetchDictionaries()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      setFilteredDictionaries(dictionaries.filter(d => d.category === selectedCategory))
    } else {
      setFilteredDictionaries(dictionaries)
    }
  }, [selectedCategory, dictionaries])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (editingItem) {
        await api.put(`/dictionaries/${editingItem.id}`, formData)
        setMessage('사전 항목이 수정되었습니다.')
      } else {
        await api.post('/dictionaries', formData)
        setMessage('사전 항목이 생성되었습니다.')
      }
      setShowForm(false)
      setEditingItem(null)
      setFormData({ category: '', name: '', value: '', order: 0 })
      fetchDictionaries()
    } catch (err: any) {
      setError(err.response?.data?.error || '오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (item: Dictionary) => {
    setEditingItem(item)
    setFormData({
      category: item.category,
      name: item.name,
      value: item.value,
      order: item.order,
    })
    setShowForm(true)
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm('정말로 이 항목을 삭제하시겠습니까?')) return

    try {
      await api.delete(`/dictionaries/${itemId}`)
      setMessage('항목이 삭제되었습니다.')
      fetchDictionaries()
    } catch (err: any) {
      setError(err.response?.data?.error || '삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <Layout>
      <div className="px-4 py-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">사전 관리</h1>
            <p className="mt-2 text-gray-600">폼에서 사용되는 사전 데이터를 관리합니다.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            새 항목
          </button>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 필터</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">전체</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">{editingItem ? '사전 항목 수정' : '새 사전 항목'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">선택하세요</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">순서</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">표시명</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">값</label>
                  <input
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? '저장 중...' : editingItem ? '수정' : '생성'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingItem(null)
                    setFormData({ category: '', name: '', value: '', order: 0 })
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">사전 목록</h3>
            {filteredDictionaries.length === 0 ? (
              <div className="text-center text-gray-500 py-8">등록된 사전 항목이 없습니다.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">카테고리</th>
                      <th className="px-4 py-3 text-left">표시명</th>
                      <th className="px-4 py-3 text-left">값</th>
                      <th className="px-4 py-3 text-left">순서</th>
                      <th className="px-4 py-3 text-left">상태</th>
                      <th className="px-4 py-3 text-left">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDictionaries.map((item) => (
                      <tr key={item.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">{item.category}</td>
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">{item.value}</td>
                        <td className="px-4 py-3">{item.order}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {item.isActive ? '활성' : '비활성'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

