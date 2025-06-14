import { z } from 'zod'

// Fruit schema
export const FruitBody = z
    .object({
        fruit_name: z.string()
            .min(1, 'Tên trái cây có ít nhất 1 ký tự')
            .max(100, 'Tên trái cây có tối đa 100 ký tự'),
        fruit_desc: z.string()
            .min(1, 'Mô tả trái cây có ít nhất 1 ký tự')
            .max(100, 'Mô tả trái cây có tối đa 100 ký tự'),
        fruit_types: z
            .array(z.string().min(1))
            .refine(
                (arr) => new Set(arr).size === arr.length,
                { message: 'Các loại trái cây không được trùng nhau' }
            ),
        fruit_images: z
            .array(
                z.instanceof(File, { message: 'Vui lòng chọn một file ảnh' })
                    .refine(
                        (file) => file.size <= 5 * 1024 * 1024,
                        { message: 'Ảnh phải nhỏ hơn 5MB' }
                    )
                    .refine(
                        (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
                        { message: 'Chỉ chấp nhận định dạng JPG, PNG hoặc GIF' }
                    )
            )
            .min(1, 'Vui lòng chọn ít nhất 1 ảnh')
            .max(5, 'Chỉ được chọn tối đa 5 ảnh'),
    })

// Fruit type schema
export const FruitTypeBody = z
    .object({
        type_name: z
            .string()
            .min(1, 'Tình trạng trái cây có ít nhất 1 ký tự')
            .max(50, 'Tình trạng cây có tối đa 50 ký tự'),
        type_desc: z
            .string()
            .min(1, 'Mô tả có ít nhất 1 ký tự')
            .max(100, 'Mô tả có tối đa 100 ký tự'),
    })

export type FruitBodyType = z.TypeOf<typeof FruitBody>
export type FruitTypeBodyType = z.TypeOf<typeof FruitTypeBody>
