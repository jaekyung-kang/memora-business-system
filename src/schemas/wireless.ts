import { z } from 'zod'

export const wirelessFormSchema = z.object({
  name: z.string().min(2, '이름을 입력해주세요'),
  phone: z.string().min(10, '전화번호를 입력해주세요'),
  birthDate: z.string().min(1, '생년월일을 입력해주세요'),
  address: z.string().min(1, '주소를 입력해주세요'),
  detailAddress: z.string().optional(),
  zipCode: z.string().min(1, '우편번호를 입력해주세요'),
  authMethod: z.string().min(1, '인증방법을 선택해주세요'),
  authValue: z.string().optional(),
  simPurchase: z.string().min(1, '유심구매여부를 선택해주세요'),
  planName: z.string().min(1, '요금제를 선택해주세요'),
  contractPeriod: z.string().min(1, '약정기간을 선택해주세요'),
})

export type WirelessFormData = z.infer<typeof wirelessFormSchema>

// 명시적 export  
export { type WirelessFormData as WirelessFormDataType }

