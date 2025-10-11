import { useState, useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'

interface KakaoPlace {
  place_name: string
  address_name: string
  road_address_name: string
  x: string
  y: string
}

interface KakaoAddressSearchProps {
  onSelect: (address: string, zipCode: string) => void
  disabled?: boolean
}

export function KakaoAddressSearch({ onSelect, disabled }: KakaoAddressSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<KakaoPlace[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 결과 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 주소 검색
  const searchAddress = async (keyword: string) => {
    if (!keyword || keyword.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY || ''

    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}&size=10`,
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
      setShowResults(true)
    } catch (error) {
      console.error('Address search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // 입력 시 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      searchAddress(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

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
    setShowResults(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowResults(true)}
            placeholder="주소 또는 건물명을 입력하세요 (예: 베네하임더힐)"
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <MapPin className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* 자동완성 결과 */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {results.map((place, index) => (
            <div
              key={index}
              onClick={() => handleSelect(place)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
            >
              <div className="font-medium text-gray-900">{place.place_name}</div>
              <div className="text-sm text-gray-600 mt-1">
                {place.road_address_name || place.address_name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 검색 중 */}
      {isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center">
          <p className="text-sm text-gray-500">검색 중...</p>
        </div>
      )}

      {/* 결과 없음 */}
      {showResults && !isLoading && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center">
          <p className="text-sm text-gray-500">검색 결과가 없습니다</p>
        </div>
      )}
    </div>
  )
}

