import { Migration } from '../model/migration.model'
import mongoose from 'mongoose'
import { removeUndefined } from '../helpers/util/object'

const MIGRATION_COLLECTION_NAME = 'Migration'

export const migrationCollection = async (db: mongoose.mongo.Db) => {
    return db.collection<Migration>(MIGRATION_COLLECTION_NAME)
}

const insertMigration = async (db: mongoose.mongo.Db, migration: Migration) => {
    const collection = await migrationCollection(db)
    return collection.insertOne(migration)
}

export const insertSuccessMigration = async (
    db: mongoose.mongo.Db,
    name: string,
    message?: string,
) => {
    const now = new Date()
    const migration: Migration = removeUndefined({
        name,
        message,
        isSuccess: true,
        processedAt: now,
    })
    await insertMigration(db, migration)
}

export const insertFailedMigration = async (
    db: mongoose.mongo.Db,
    name: string,
    message?: string,
) => {
    const now = new Date()
    const migration: Migration = removeUndefined({
        name,
        message,
        isSuccess: false,
        processedAt: now,
    })
    await insertMigration(db, migration)
}

export const isMigrationSuccessfullyProcessed = async (
    db: mongoose.mongo.Db,
    name: string,
) => {
    const collection = await migrationCollection(db)
    return collection.findOne({
        name,
        isSuccess: true,
        processedAt: { $exists: true },
    })
}
