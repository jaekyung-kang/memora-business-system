export interface KakaoAddressResult {
  address_name: string
  road_address: {
    address_name: string
    zone_no: string
  } | null
  address: {
    address_name: string
  }
}

// 카카오 REST API로 주소 검색
export const searchKakaoAddress = async (query: string): Promise<KakaoAddressResult[]> => {
  const apiKey = import.meta.env.VITE_KAKAO_API_KEY || ''
  
  if (!apiKey) {
    throw new Error('카카오 API 키가 설정되지 않았습니다')
  }

  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `KakaoAK ${apiKey}`
      }
    }
  )

  if (!response.ok) {
    throw new Error('주소 검색에 실패했습니다')
  }

  const data = await response.json()
  return data.documents || []
}

// Daum Postcode 서비스 (무료, API 키 불필요)
export interface KakaoPostcodeResult {
  address: string
  zonecode: string
  roadAddress: string
  jibunAddress: string
  buildingName: string
}

export const loadKakaoPostcode = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).daum) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Kakao Postcode script'))
    document.head.appendChild(script)
  })
}

export const openKakaoPostcode = (
  onComplete: (data: KakaoPostcodeResult) => void
) => {
  if (!(window as any).daum) {
    console.error('Kakao Postcode script not loaded')
    return
  }

  new (window as any).daum.Postcode({
    oncomplete: onComplete
  }).open()
}

