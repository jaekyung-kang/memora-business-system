import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Plus } from 'lucide-react'

export function WirelessPage() {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">무선 접수</h1>
            <p className="mt-2 text-gray-600">무선 서비스 가입 접수 목록입니다.</p>
          </div>
          <button
            onClick={() => navigate('/wireless/new')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            새 접수
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-center py-8">
            접수 내역이 없습니다. "새 접수" 버튼을 클릭하여 접수를 시작하세요.
          </p>
        </div>
      </div>
    </Layout>
  )
}

