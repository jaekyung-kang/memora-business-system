import { useState } from 'react'
import { X, Search, MapPin } from 'lucide-react'

interface KakaoPlace {
  place_name: string
  address_name: string
  road_address_name: string
}

interface KakaoAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (address: string, zipCode: string) => void
}

export function KakaoAddressModal({ isOpen, onClose, onSelect }: KakaoAddressModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<KakaoPlace[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 주소 검색
  const searchAddress = async () => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY || ''

    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=15`,
        {
          headers: {
            Authorization: `KakaoAK ${apiKey}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('주소 검색 실패')
      }

      const data = await response.json()
      setResults(data.documents || [])
    } catch (error) {
      console.error('Address search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = async (place: KakaoPlace) => {
    const address = place.road_address_name || place.address_name
    
    // 우편번호 조회
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
        {
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        const zipCode = data.documents[0]?.road_address?.zone_no || 
                        data.documents[0]?.address?.zip_code || ''
        onSelect(address, zipCode)
      } else {
        onSelect(address, '')
      }
    } catch (err) {
      onSelect(address, '')
    }

    setQuery('')
    setResults([])
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      searchAddress()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">주소 검색</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 검색 입력 */}
        <div className="p-6 border-b">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="주소 또는 건물명을 입력하세요 (예: 베네하임더힐)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={searchAddress}
              disabled={!query || query.length < 2}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              검색
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            도로명, 건물명, 지번 등으로 검색할 수 있습니다
          </p>
        </div>

        {/* 검색 결과 */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600 mt-4">검색 중...</p>
            </div>
          )}

          {!isLoading && results.length === 0 && query && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">검색 결과가 없습니다</p>
              <p className="text-sm text-gray-500 mt-2">다른 키워드로 검색해보세요</p>
            </div>
          )}

          {!isLoading && !query && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">주소를 검색해주세요</p>
              <p className="text-sm text-gray-500 mt-2">건물명이나 도로명을 입력하세요</p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="space-y-2">
              {results.map((place, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(place)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition"
                >
                  <div className="font-semibold text-gray-900 mb-1">
                    {place.place_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {place.road_address_name || place.address_name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

