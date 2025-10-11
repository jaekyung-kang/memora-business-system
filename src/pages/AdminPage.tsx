import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Users, BookOpen, FileText, ClipboardList, Shield } from 'lucide-react'

// Sub-pages
import { AdminUsersPage } from './admin/AdminUsersPage'
import { AdminDictionariesPage } from './admin/AdminDictionariesPage'
import { AdminMastersPage } from './admin/AdminMastersPage'
import { AdminAddressBookPage } from './admin/AdminAddressBookPage'
import { AdminAuditPage } from './admin/AdminAuditPage'

function AdminDashboard() {
  const navigate = useNavigate()

  const adminMenus = [
    { title: '사용자 관리', icon: Users, path: '/admin/users', desc: '시스템 사용자를 관리합니다' },
    { title: '마스터 관리', icon: Shield, path: '/admin/masters', desc: '마스터 계정을 관리합니다' },
    { title: '사전 관리', icon: BookOpen, path: '/admin/dictionaries', desc: '폼 데이터를 관리합니다' },
    { title: '주소록 관리', icon: FileText, path: '/admin/address-book', desc: '주소록을 관리합니다' },
    { title: '감사 로그', icon: ClipboardList, path: '/admin/audit', desc: '시스템 로그를 확인합니다' },
  ]

  return (
    <Layout>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="mt-2 text-gray-600">시스템 관리 및 마스터 계정 관리를 수행할 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {adminMenus.map((menu) => (
            <div
              key={menu.path}
              onClick={() => navigate(menu.path)}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
            >
              <div className="flex items-center mb-4">
                <menu.icon className="w-5 h-5 mr-2 text-blue-600" />
                <h3 className="text-lg font-semibold">{menu.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{menu.desc}</p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                관리하기
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export function AdminPage() {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsersPage />} />
      <Route path="masters" element={<AdminMastersPage />} />
      <Route path="dictionaries" element={<AdminDictionariesPage />} />
      <Route path="address-book" element={<AdminAddressBookPage />} />
      <Route path="audit" element={<AdminAuditPage />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
