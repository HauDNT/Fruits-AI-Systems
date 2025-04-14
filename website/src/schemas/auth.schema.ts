import z from 'zod'

// Login schema
export const LoginBody = z
    .object({
        username: z.string().min(8, 'Tên đăng nhập phải có ít nhất 8 ký tự').max(50, 'Tên đăng nhập phải có tối đa ký tự'),
        password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').max(50, 'Mật khẩu phải có tối đa ký tự'),
    })
    .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

// Register schema
export const RegisterBody = z
    .object({
        username: z.string().min(8, 'Tên đăng nhập phải có ít nhất 8 ký tự').max(50, 'Tên đăng nhập phải có tối đa ký tự'),
        password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').max(50, 'Mật khẩu phải có tối đa ký tự'),
        re_password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').max(50, 'Mật khẩu phải có tối đa ký tự'),
        account_type: z.string().min(1, 'Bạn phải chọn loại tài khoản').max(1, 'Bạn phải chọn loại tài khoản'),
    })
    .strict()

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>