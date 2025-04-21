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
            )
    })

// Fruit type schema
export const FruitTypeBody = z
    .object({
        type_name: z.string()
            .min(3, 'Tên tình trạng có ít nhất 3 ký tự')
            .max(50, 'Tên tình trạng có tối đa 50 ký tự'),
        type_desc: z.string()
            .min(3, 'Mô tả tình trạng có ít nhất 3 ký tự')
            .max(50, 'Mô tả tình trạng có tối đa 50 ký tự'),
    })

export type FruitBodyType = z.TypeOf<typeof FruitBody>
export type FruitTypeBodyType = z.TypeOf<typeof FruitTypeBody>
