import z from 'zod'

// Fruit schema
export const AreaBody = z
    .object({
        area_desc: z.string()
            .min(3, 'Mô tả trái cây có ít nhất 3 ký tự')
            .max(50, 'Mô tả trái cây có tối đa 50 ký tự'),
        area_image: z
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

// Fruit type schema
export const AreaTypeBody = z
    .object({
        area_desc: z.string()
            .min(3, 'Mô tả khu phân loại có ít nhất 3 ký tự')
            .max(50, 'Mô tả khu phân loại có tối đa 50 ký tự'),
        area_image: z
            .instanceof(File, { message: 'Vui lòng chọn một file ảnh' })
            .refine(
                (file) => file.size <= 5 * 1024 * 1024,
                { message: 'Ảnh phải nhỏ hơn 5MB' }
            )
            .refine(
                (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
                { message: 'Chỉ chấp nhận định dạng JPG, PNG hoặc GIF' }
            ),
    })

export type AreaBodyType = z.TypeOf<typeof AreaBody>
export type AreaTypeBodyType = z.TypeOf<typeof AreaTypeBody>
