import { ZodSchema, z } from 'zod'

function safeValidateString<T>(
    data: string,
    schema: ZodSchema<T>,
): { validatedValue?: T; error?: string } {
    const validatedData = schema.safeParse(data)
    if ('error' in validatedData) {
        return { error: validatedData.error!.errors[0].message }
    }
    return { validatedValue: validatedData.data }
}

const emailSchema = z.string().email()

export function validateEmail(email?: string) {
    if (!email) {
        return undefined
    }
    const { error: validationError } = safeValidateString(
        email.trim(),
        emailSchema,
    )
    if (validationError) {
        return undefined
    }
    return email.trim()
}
