/* eslint-disable */

import { ZodError } from 'zod';

export function validate<T>(data: Partial<T>, schema: any): T {
    const validatedData = schema.safeParse(data)
    if (!validatedData.success && 'error' in validatedData) {
        const error = validatedData.error as ZodError;
        throw new Error(error.errors[0].message)
    }
    return validatedData.data
}
