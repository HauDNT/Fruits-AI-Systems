import z from "zod"

export const EmployeeBody = z
    .object({
        fullname: z.string({ message: 'Vui lòng nhập họ và tên' }),
        gender: z.string({ message: 'Vui lòng chọn giới tính' }),
        phone_number: z.string({ message: 'Vui lòng nhập số điện thoại' }),
        areaId: z.string({ message: 'Vui lòng chọn khu vực lắp đặt' }),
        employee_image: z
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

export type EmployeeBodyType = z.TypeOf<typeof EmployeeBody>