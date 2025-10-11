import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'

interface User {
  id: string
  name: string | null
  email: string | null
  username: string | null
  companyCode: string | null
  role: string
}

interface AuthContextType {
  user: User | null
  login: (companyCode: string, username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // localStorage에서 사용자 정보 복원
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (companyCode: string, username: string, password: string) => {
    try {
      // Supabase User 테이블에서 직접 조회
      const { data: userData, error } = await supabase
        .from('User')
        .select('*')
        .eq('companyCode', companyCode)
        .eq('username', username)
        .single()

      if (error || !userData) {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다')
      }

      // 비밀번호 검증 (간단한 검증 - 실제로는 해시 비교 필요)
      // 참고: Supabase User 테이블에는 password 컬럼이 없을 수 있습니다
      // 임시로 username이 'admin'이면 로그인 허용
      if (username !== 'admin') {
        throw new Error('권한이 없습니다')
      }

      // 사용자 정보 저장
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error: any) {
      throw new Error(error.message || '로그인에 실패했습니다')
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
