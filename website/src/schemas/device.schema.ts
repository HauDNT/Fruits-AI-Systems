import z from "zod";

export const DeviceBody = z
    .object({
        type_id: z.string({ message: 'Vui lòng chọn loại thiết bị'}),
        area_id: z.string({ message: 'Vui lòng chọn khu vực lắp đặt'}),
        status_id: z.string({ message: 'Vui lòng chọn trạng thái thiết bị'}),
        device_image: z
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

export const DeviceTypeBody = z
    .object({
        type_name: z
            .string()
            .min(3, { message: 'Tên loại thiết bị có ít nhất 3 ký tự' })
            .max(50, { message: 'Tên loại thiết bị có nhiều nhất 50 ký tự' })
    })

export const DeviceStatusBody = z
    .object({
        status_name: z
            .string()
            .min(3, { message: 'Tình trạng thiết bị có ít nhất 3 ký tự' })
            .max(50, { message: 'Tình trạng thiết bị có nhiều nhất 50 ký tự' })
    })

export type DeviceBodyType = z.TypeOf<typeof DeviceBody>
export type DeviceTypeBodyType = z.TypeOf<typeof DeviceTypeBody>
export type DeviceStatusBodyType = z.TypeOf<typeof DeviceStatusBody>