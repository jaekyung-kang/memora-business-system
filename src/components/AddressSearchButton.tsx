import { MapPin } from 'lucide-react'
import { loadKakaoPostcode, openKakaoPostcode } from '../lib/kakao-postcode'

interface AddressSearchButtonProps {
  onSelect: (address: string, zipCode: string) => void
}

export function AddressSearchButton({ onSelect }: AddressSearchButtonProps) {
  const handleClick = async () => {
    try {
      await loadKakaoPostcode()
      openKakaoPostcode((data) => {
        const address = data.roadAddress || data.jibunAddress
        const zipCode = data.zonecode
        onSelect(address, zipCode)
      })
    } catch (error) {
      console.error('Failed to load address search:', error)
      alert('주소 검색 기능을 불러오는데 실패했습니다.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 inline-flex items-center"
    >
      <MapPin className="w-4 h-4 mr-2" />
      주소 검색
    </button>
  )
}

