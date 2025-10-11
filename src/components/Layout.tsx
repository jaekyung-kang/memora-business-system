import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, Wifi, Smartphone, Shield, Users, Database, FileText, Settings, LogOut } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const mainNav = [
    { name: '대시보드', path: '/', icon: Home },
    { name: '유선 접수', path: '/wired', icon: Wifi },
    { name: '무선 접수', path: '/wireless', icon: Smartphone },
  ]

  const adminNav = [
    { name: '관리자 설정', path: '/admin', icon: Shield },
    { name: '사용자 관리', path: '/admin/users', icon: Users },
    { name: '사전 관리', path: '/admin/dictionaries', icon: Database },
    { name: '주소록 관리', path: '/admin/address-book', icon: FileText },
    { name: '감사 로그', path: '/admin/audit', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-900">Memora</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {mainNav.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </button>
                  )
                })}
                {user?.role === 'admin' && (
                  <div className="ml-4 pl-4 border-l border-gray-200 flex space-x-8">
                    {adminNav.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {item.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

