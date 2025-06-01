import { z } from 'zod'

export const EmployeeBody = z
    .object({
        fullname: z
            .string({ message: 'Vui lòng nhập họ và tên' })
            .min(5, { message: 'Họ và tên có ít nhất 5 ký tự' })
            .max(100, { message: 'Họ và tên có nhiều nhất 100 ký tự' }),
        gender: z.string({ message: 'Vui lòng chọn giới tính' }),
        phone_number: z
            .string({ message: 'Vui lòng nhập số điện thoại' })
            .min(1, { message: 'Số điện thoại có ít nhất 1 ký tự' })
            .max(11, { message: 'Số điện thoại có nhiều nhất 11 ký tự' }),
        area_id: z.string({ message: 'Vui lòng chọn khu vực lắp đặt' }),
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