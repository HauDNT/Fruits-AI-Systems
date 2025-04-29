// Fruit Classify schema
import z from "zod";

export const FruitClassifyBody = z
    .object({
        confidence_level: z.string(),
        classify_image: z
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
        fruitId: z.string(),
        typeId: z.string(),
        areaId: z.string(),
        batchId: z.string(),
    })

export type FruitClassifyBodyType = z.TypeOf<typeof FruitClassifyBody>