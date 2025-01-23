import mongoose, { Schema } from 'mongoose'

export interface Migration {
    name: string
    message?: string
    isSuccess?: boolean
    processedAt?: Date
}

export const MigrationSchema: Schema<Migration> = new Schema({
    name: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: false,
    },
    isSuccess: {
        type: Boolean,
        required: false,
    },
    processedAt: {
        type: Date,
        default: Date.now,
    },
})

MigrationSchema.index({ name: 1, isSuccess: 1, processedAt: 1 })

export const MigrationModel = mongoose.model<Migration>(
    'Migration',
    MigrationSchema,
)
