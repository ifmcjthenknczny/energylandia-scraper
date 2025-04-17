import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

type AsyncHandler = (req: Request) => Promise<NextResponse>

const handleRequest =
    (handler: AsyncHandler): AsyncHandler =>
    async (req) => {
        try {
            return await handler(req)
        } catch (err: any) {
            const status = err instanceof ZodError ? 400 : 500
            return NextResponse.json({ error: err.message }, { status })
        }
    }

export default handleRequest
