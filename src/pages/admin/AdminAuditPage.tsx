import { Layout } from '../../components/Layout'
import { ClipboardList } from 'lucide-react'

export function AdminAuditPage() {
  return (
    <Layout>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">감사 로그</h1>
          <p className="mt-2 text-gray-600">시스템 활동 로그를 확인합니다.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">감사 로그 기능</p>
            <p className="text-sm text-gray-500 mt-2">구현 예정</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

