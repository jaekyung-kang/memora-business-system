import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const [companyCode, setCompanyCode] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!companyCode || !username || !password) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    setIsLoading(true)

    try {
      await login(companyCode, username, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">MEMORA</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">로그인</h2>
          <p className="text-center text-gray-600 mb-6">
            업체코드, 아이디, 비밀번호를 입력해주세요
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                업체코드 *
              </label>
              <input
                type="text"
                placeholder="예: 08"
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">숫자 2자리</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                아이디 *
              </label>
              <input
                type="text"
                placeholder="영문/숫자 4~20자"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 *
              </label>
              <input
                type="password"
                placeholder="최소 8자 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !companyCode || !username || !password}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">© 2024 MEMORA. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

