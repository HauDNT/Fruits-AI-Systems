import z from 'zod'

export const UserBody = z
    .object({
        username: z.string()
            .min(3, 'Tên tài khoản có ít nhất 3 ký tự')
            .max(50, 'Tên tài khoản có tối đa 50 ký tự'),
        password: z.string()
            .min(3, 'Mật khẩu có ít nhất 3 ký tự')
            .max(50, 'Mật khẩu có tối đa 50 ký tự'),
    })

export type UserBodyType = z.TypeOf<typeof UserBody>
