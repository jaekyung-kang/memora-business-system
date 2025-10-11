export interface KakaoPostcodeResult {
  address: string
  zonecode: string
  addressEnglish: string
  addressType: string
  userSelectedType: string
  userLanguageType: string
  roadAddress: string
  jibunAddress: string
  buildingName: string
  apartment: string
  sido: string
  sigungu: string
  bname: string
  buildingCode: string
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

