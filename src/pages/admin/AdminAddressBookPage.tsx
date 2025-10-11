import { Layout } from '../../components/Layout'
import { FileText } from 'lucide-react'

export function AdminAddressBookPage() {
  return (
    <Layout>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">주소록 관리</h1>
          <p className="mt-2 text-gray-600">주소록 데이터를 관리합니다.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">주소록 관리 기능</p>
            <p className="text-sm text-gray-500 mt-2">구현 예정</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

