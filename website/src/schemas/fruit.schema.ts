import z from 'zod'

// Fruit schema
export const FruitBody = z
    .object({
        fruit_name: z.string()
            .min(3, 'Tên trái cây có ít nhất 3 ký tự')
            .max(50, 'Tên trái cây có tối đa 50 ký tự'),
        fruit_desc: z.string()
            .min(3, 'Mô tả trái cây có ít nhất 3 ký tự')
            .max(50, 'Mô tả trái cây có tối đa 50 ký tự'),
        fruit_types: z
            .array(z.string().min(1))
            .refine(
                (arr) => new Set(arr).size === arr.length,
                { message: 'Các loại trái cây không được trùng nhau' }
            ),
        fruit_image: z
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
export const FruitTypeBody = z
    .object({
        type_name: z.string()
            .min(3, 'Tình trạng trái cây có ít nhất 3 ký tự')
            .max(50, 'Tình trạng cây có tối đa 50 ký tự'),
        type_desc: z.string()
            .min(3, 'Mô tả có ít nhất 3 ký tự')
            .max(50, 'Mô tả có tối đa 50 ký tự'),
    })

export type FruitBodyType = z.TypeOf<typeof FruitBody>
export type FruitTypeBodyType = z.TypeOf<typeof FruitTypeBody>
