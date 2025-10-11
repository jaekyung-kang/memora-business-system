import { useState, useEffect } from 'react'
import { Layout } from '../../components/Layout'
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface User {
  id: string
  name: string
  email: string
  role: string
  code: string
  phone: string
  isActive: boolean
  createdAt: string
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER',
    code: '',
    phone: '',
  })

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .order('createdAt', { ascending: false })

      if (!error && data) {
        setUsers(data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (editingUser) {
        const { error } = await supabase
          .from('User')
          .update(formData)
          .eq('id', editingUser.id)

        if (error) throw error
        setMessage('사용자가 수정되었습니다.')
      } else {
        const { error } = await supabase
          .from('User')
          .insert({
            ...formData,
            isActive: true
          })

        if (error) throw error
        setMessage('사용자가 생성되었습니다.')
      }
      setShowForm(false)
      setEditingUser(null)
      setFormData({ name: '', email: '', role: 'USER', code: '', phone: '' })
      fetchUsers()
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role,
      code: user.code || '',
      phone: user.phone || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase
        .from('User')
        .delete()
        .eq('id', userId)

      if (error) throw error
      setMessage('사용자가 삭제되었습니다.')
      fetchUsers()
    } catch (err: any) {
      setError(err.message || '삭제 중 오류가 발생했습니다.')
    }
  }

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('User')
        .update({ isActive: !isActive })
        .eq('id', userId)

      if (error) throw error
      setMessage(`사용자가 ${!isActive ? '활성화' : '비활성화'}되었습니다.`)
      fetchUsers()
    } catch (err: any) {
      setError(err.message || '상태 변경 중 오류가 발생했습니다.')
    }
  }

  return (
    <Layout>
      <div className="px-4 py-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
            <p className="mt-2 text-gray-600">시스템 사용자를 관리하고 권한을 설정합니다.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            새 사용자
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

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">{editingUser ? '사용자 수정' : '새 사용자'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">역할</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="USER">사용자</option>
                    <option value="MASTER">관리자</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">사용자 코드</label>
                  <input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="고유 코드"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                  <input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="010-1234-5678"
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
                  {isLoading ? '저장 중...' : editingUser ? '수정' : '생성'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingUser(null)
                    setFormData({ name: '', email: '', role: 'USER', code: '', phone: '' })
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
            <h3 className="text-lg font-semibold mb-4">사용자 목록</h3>
            {users.length === 0 ? (
              <div className="text-center text-gray-500 py-8">등록된 사용자가 없습니다.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">이름</th>
                      <th className="px-4 py-3 text-left">이메일</th>
                      <th className="px-4 py-3 text-left">역할</th>
                      <th className="px-4 py-3 text-left">코드</th>
                      <th className="px-4 py-3 text-left">상태</th>
                      <th className="px-4 py-3 text-left">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${user.role === 'MASTER' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {user.role === 'MASTER' ? '관리자' : '사용자'}
                          </span>
                        </td>
                        <td className="px-4 py-3">{user.code || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.isActive ? '활성' : '비활성'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user.id, user.isActive)}
                              className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                            >
                              {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
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

