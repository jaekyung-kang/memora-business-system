import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { wirelessFormSchema } from '../schemas/wireless'
import type { WirelessFormData } from '../schemas/wireless'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function WirelessNewPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [dictionaries, setDictionaries] = useState<any>({})

  const { register, handleSubmit, formState: { errors } } = useForm<WirelessFormData>({
    resolver: zodResolver(wirelessFormSchema)
  })

  useEffect(() => {
    const loadDictionaries = async () => {
      try {
        const { data, error } = await supabase
          .from('Dictionary')
          .select('*')
          .eq('isActive', true)
          .order('order', { ascending: true })

        if (!error && data) {
          const dict = data.reduce((acc: any, item: any) => {
            if (!acc[item.category]) acc[item.category] = []
            acc[item.category].push(item)
            return acc
          }, {})
          setDictionaries(dict)
        }
      } catch (err) {
        console.error('Dictionary load error:', err)
      }
    }
    loadDictionaries()
  }, [])

  const onSubmit = async (data: WirelessFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('WirelessForm')
        .insert({
          ...data,
          authorId: user?.id,
          birthDate: new Date(data.birthDate).toISOString(),
          status: 'PENDING'
        })

      if (error) throw error
      navigate('/wireless')
    } catch (err: any) {
      setError(err.message || '접수 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">무선 접수</h1>
          <p className="mt-2 text-gray-600">무선 통신 서비스 가입 접수를 진행합니다.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                  <input
                    {...register('name')}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">전화번호 *</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="010-1234-5678"
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">생년월일 *</label>
                  <input
                    {...register('birthDate')}
                    type="date"
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.birthDate && <p className="text-sm text-red-600 mt-1">{errors.birthDate.message}</p>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주소 *</label>
              <input
                {...register('address')}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">서비스 정보</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">인증방법 *</label>
                  <select
                    {...register('authMethod')}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택하세요</option>
                    {dictionaries.AUTH_METHOD?.map((item: any) => (
                      <option key={item.id} value={item.value}>{item.name}</option>
                    ))}
                  </select>
                  {errors.authMethod && <p className="text-sm text-red-600 mt-1">{errors.authMethod.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">유심구매 *</label>
                  <select
                    {...register('simPurchase')}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택하세요</option>
                    {dictionaries.SIM_PURCHASE?.map((item: any) => (
                      <option key={item.id} value={item.value}>{item.name}</option>
                    ))}
                  </select>
                  {errors.simPurchase && <p className="text-sm text-red-600 mt-1">{errors.simPurchase.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">요금제 *</label>
                  <select
                    {...register('planName')}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택하세요</option>
                    {dictionaries.PLAN_NAME?.map((item: any) => (
                      <option key={item.id} value={item.value}>{item.name}</option>
                    ))}
                  </select>
                  {errors.planName && <p className="text-sm text-red-600 mt-1">{errors.planName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">약정기간 *</label>
                  <select
                    {...register('contractPeriod')}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택하세요</option>
                    {dictionaries.CONTRACT_PERIOD?.map((item: any) => (
                      <option key={item.id} value={item.value}>{item.name}</option>
                    ))}
                  </select>
                  {errors.contractPeriod && <p className="text-sm text-red-600 mt-1">{errors.contractPeriod.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? '접수 중...' : '접수하기'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/wireless')}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

