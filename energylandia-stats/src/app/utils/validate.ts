// eslint-disable-next-line
export function validate<T>(data: Partial<T>, schema: any): T {
    const validatedData = schema.safeParse(data)
    if ('error' in validatedData && validatedData.error) {
        throw new Error(validatedData.error.errors[0].message)
    }
    return validatedData.data
}
