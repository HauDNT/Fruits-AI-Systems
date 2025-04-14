import z from 'zod'

// Reset password forms schema
export const VerifyEmailFormSchema = z
    .object({
        email: z.string().email({message: 'Email không hợp lệ'}).min(10).max(50),
    })
    .strict()

export const VerifyCodeFormSchema = z
    .object({
        verifyCode: z.string().length(6, 'Mã xác thực không hợp lệ'),
    })
    .strict()

export const ChangePasswordFormSchema = z
    .object({
        password: z.string().min(5).max(50),
        re_password: z.string().min(5).max(50),
    })
    .strict()

export type VerifyEmailFormSchemaType = z.TypeOf<typeof VerifyEmailFormSchema>
export type VerifyCodeFormSchemaType = z.TypeOf<typeof VerifyCodeFormSchema>
export type ChangePasswordFormSchemaType = z.TypeOf<typeof ChangePasswordFormSchema>