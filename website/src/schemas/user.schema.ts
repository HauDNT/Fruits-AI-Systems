import z from 'zod'

export const UserBody = z
    .object({
        username: z.string()
            .min(1, 'Tên tài khoản có ít nhất 1 ký tự')
            .max(50, 'Tên tài khoản có tối đa 50 ký tự'),
        password: z.string()
            .min(1, 'Mật khẩu có ít nhất 1 ký tự')
            .max(50, 'Mật khẩu có tối đa 50 ký tự'),
    })

export type UserBodyType = z.TypeOf<typeof UserBody>
