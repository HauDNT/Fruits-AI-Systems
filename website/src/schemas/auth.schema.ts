import z from 'zod'

// Login schema
export const LoginBody = z
    .object({
        username: z.string().min(8, 'Tên đăng nhập phải có ít nhất 8 ký tự').max(50, 'Tên đăng nhập phải có tối đa ký tự'),
        password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').max(50, 'Mật khẩu phải có tối đa ký tự'),
    })
    .strict()

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

// Register schema
export const RegisterBody = z
    .object({
        username: z.string().min(8, 'Tên đăng nhập phải có ít nhất 8 ký tự').max(50, 'Tên đăng nhập phải có tối đa ký tự'),
        password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').max(50, 'Mật khẩu phải có tối đa ký tự'),
        re_password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').max(50, 'Mật khẩu phải có tối đa ký tự'),
        account_type: z.string().min(1, 'Bạn phải chọn loại tài khoản').max(1, 'Bạn phải chọn loại tài khoản'),
    })
    .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>
export type FruitTypeBodyType = z.TypeOf<typeof FruitTypeBody>
export type RegisterBodyType = z.TypeOf<typeof RegisterBody>