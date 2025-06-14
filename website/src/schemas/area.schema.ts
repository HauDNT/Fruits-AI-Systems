import { z } from 'zod'

// Area schema
export const AreaBody = z
    .object({
        area_desc: z.string()
            .min(8, 'Mô tả khu có ít nhất 8 ký tự')
            .max(50, 'Mô tả khu có tối đa 50 ký tự'),
        image_url: z
            .instanceof(File, { message: 'Vui lòng chọn một file ảnh' })
            .refine(
                (file) => file !== null,
                { message: 'Vui lòng chọn một file ảnh' }
            )
            .refine(
                (file) => file.size <= 5 * 1024 * 1024, // Giới hạn 5MB
                { message: 'Ảnh phải nhỏ hơn 5MB' }
            )
            .refine(
                (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
                { message: 'Chỉ chấp nhận định dạng JPG, PNG hoặc GIF' }
            ),
    })

export type AreaBodyType = z.TypeOf<typeof AreaBody>
