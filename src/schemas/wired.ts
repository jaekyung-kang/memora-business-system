import { z } from 'zod'

export const wiredFormSchema = z.object({
  name: z.string().min(2, '이름을 입력해주세요'),
  phone: z.string().min(10, '전화번호를 입력해주세요'),
  birthDate: z.string().min(1, '생년월일을 입력해주세요'),
  address: z.string().min(1, '주소를 입력해주세요'),
  detailAddress: z.string().optional(),
  zipCode: z.string().min(1, '우편번호를 입력해주세요'),
  paymentMethod: z.enum(['ACCOUNT', 'CARD'], { required_error: '납부방법을 선택해주세요' }),
  accountInfo: z.string().optional(),
  cardInfo: z.string().optional(),
  serviceType: z.string().min(1, '서비스 유형을 선택해주세요'),
  planName: z.string().min(1, '요금제를 선택해주세요'),
  contractPeriod: z.string().min(1, '약정기간을 선택해주세요'),
})

export type WiredFormData = z.infer<typeof wiredFormSchema>

// 명시적 export
export { type WiredFormData as WiredFormDataType }

