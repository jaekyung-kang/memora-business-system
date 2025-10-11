import { Layout } from '../../components/Layout'
import { Shield } from 'lucide-react'

export function AdminMastersPage() {
  return (
    <Layout>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">마스터 계정 관리</h1>
          <p className="mt-2 text-gray-600">마스터 계정을 생성, 수정, 삭제할 수 있습니다.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">마스터 계정 관리 기능</p>
            <p className="text-sm text-gray-500 mt-2">구현 예정</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

