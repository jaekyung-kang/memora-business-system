import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h2>
          <p className="text-gray-600">이동통신 가입 접수 시스템에 오신 것을 환영합니다.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">빠른 작업</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/wired')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <h4 className="font-medium mb-1">유선 접수</h4>
              <p className="text-sm text-gray-600">유선 서비스 가입 접수</p>
            </button>
            <button
              onClick={() => navigate('/wireless')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <h4 className="font-medium mb-1">무선 접수</h4>
              <p className="text-sm text-gray-600">무선 서비스 가입 접수</p>
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
              >
                <h4 className="font-medium mb-1">관리자 설정</h4>
                <p className="text-sm text-gray-600">시스템 관리 및 설정</p>
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

