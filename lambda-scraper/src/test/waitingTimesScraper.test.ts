import { Day, Hour } from '../helpers/util/date'
import { dataEntryToWaitingTime, mapNaNsToZeros } from '../helpers/mapper'
import { log, logWarn } from '../helpers/util/log'

import { ScriptContext } from '../context'
import axios from 'axios'
import dayjs from 'dayjs'
import { findOpeningAndClosingHour } from '../client/openingHours'
import mongoose from 'mongoose'
import { scrapeEnergylandiaWaitingTimes } from '../scrapers/waitingTimesScraper'
import timezone from 'dayjs/plugin/timezone'
import { upsertWaitingTimes } from '../client/attractionWaitingTime'
import utc from 'dayjs/plugin/utc'

dayjs.extend(timezone)
dayjs.extend(utc)

jest.mock('axios')
jest.mock('../client/attractionWaitingTime')
jest.mock('../helpers/util/log')
jest.mock('../client/openingHours')
jest.mock('../helpers/mapper')

const mockedAxios = axios as jest.Mocked<typeof axios>
const mockedInsertWaitingTimes = upsertWaitingTimes as jest.MockedFunction<
    typeof upsertWaitingTimes
>
const mockedLog = log as jest.MockedFunction<typeof log>
const mockedLogWarn = logWarn as jest.MockedFunction<typeof logWarn>
const mockedGetOpeningAndClosingHour =
    findOpeningAndClosingHour as jest.MockedFunction<
        typeof findOpeningAndClosingHour
    >
const mockedDataEntryToWaitingTime =
    dataEntryToWaitingTime as jest.MockedFunction<typeof dataEntryToWaitingTime>
const mockedMapNaNsToZeros = mapNaNsToZeros as jest.MockedFunction<
    typeof mapNaNsToZeros
>

describe('scrapeEnergylandiaWaitingTimes', () => {
    const context: ScriptContext = {
        executionId: 'test',
        // eslint-disable-next-line
        db: {} as any,
        now: new Date(),
    }

    const mockScrapedWaitingTimes = {
        draw: 1,
        recordsTotal: 1,
        recordsFiltered: 1,
        data: [['Attraction 1', '10', 'active', '12:00 01.01.2024']],
    }

    const mockMappedWaitingTime = {
        attractionName: 'Attraction 1',
        waitingTimeMinutes: 10,
        isInactive: false,
        lastUpdate: new Date(),
        date: '2024-10-05' as Day,
        time: '10:15' as Hour,
        dayOfWeek: 6,
        scrapedAt: new Date(),
    }

    const mockMappedClosedAttractionWaitingTime = {
        attractionName: 'Attraction 1',
        waitingTimeMinutes: 0,
        isInactive: true,
        lastUpdate: new Date(),
        date: '2024-10-05' as Day,
        time: '10:15' as Hour,
        dayOfWeek: 6,
        scrapedAt: new Date(),
    }

    const mockOpeningHours = {
        _id: new mongoose.Types.ObjectId(),
        date: '2024-10-05' as Day,
        openingHour: '09:00' as Hour,
        closingHour: '18:00' as Hour,
        isOpen: true,
        scrapedAt: new Date(),
    }

    const mockClosedOpeningHours = {
        _id: new mongoose.Types.ObjectId(),
        date: '2024-10-05' as Day,
        isOpen: false,
        scrapedAt: new Date(),
    }

    beforeEach(() => {
        mockedAxios.post.mockResolvedValue({ data: mockScrapedWaitingTimes })
        mockedMapNaNsToZeros.mockImplementation((waitingTime) => waitingTime)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should scrape, map, and insert waiting times', async () => {
        mockedDataEntryToWaitingTime.mockReturnValue(mockMappedWaitingTime)
        mockedGetOpeningAndClosingHour.mockResolvedValue(mockOpeningHours)

        await scrapeEnergylandiaWaitingTimes(context)

        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(String),
        )
        expect(mockedLog).toHaveBeenCalledWith('SCRAPED WAITING TIME DATA!')
        expect(mockedDataEntryToWaitingTime).toHaveBeenCalledWith(
            mockScrapedWaitingTimes.data[0],
            context.now,
        )
        expect(mockedLog).toHaveBeenCalledWith('MAPPED WAITING TIME DATA!')
        expect(mockedInsertWaitingTimes).toHaveBeenCalledWith(context.db, [
            mockMappedWaitingTime,
        ])
        expect(mockedLog).toHaveBeenCalledWith(
            'INSERTED ATTRACTION WAITING TIME DATA INTO DB',
        )
    })

    it('should log a warning if all attractions are inactive or have zero waiting time', async () => {
        mockedGetOpeningAndClosingHour.mockResolvedValue(mockOpeningHours)
        mockedDataEntryToWaitingTime.mockReturnValueOnce(
            mockMappedClosedAttractionWaitingTime,
        )

        await scrapeEnergylandiaWaitingTimes({
            ...context,
            now: dayjs.tz('2024-10-05 12:00', 'Europe/Warsaw').toDate(),
        })

        expect(mockedLogWarn).toHaveBeenCalledWith(
            'ALL ATTRACTIONS ARE INACTIVE. HAVE NOT INSERTED ANY DATA',
        )
        expect(mockedInsertWaitingTimes).not.toHaveBeenCalled()
    })

    it('should log a warning if Energylandia is closed', async () => {
        mockedDataEntryToWaitingTime.mockReturnValue(
            mockMappedClosedAttractionWaitingTime,
        )
        mockedGetOpeningAndClosingHour.mockResolvedValue(mockClosedOpeningHours)

        await scrapeEnergylandiaWaitingTimes(context)

        expect(mockedLogWarn).toHaveBeenCalledWith(
            'ENERGYLANDIA IS CLOSED. HAVE NOT INSERTED ANY DATA',
        )
        expect(mockedInsertWaitingTimes).not.toHaveBeenCalled()
    })

    it('should log a warning if no opening hours are found', async () => {
        mockedDataEntryToWaitingTime.mockReturnValue(
            mockMappedClosedAttractionWaitingTime,
        )
        mockedGetOpeningAndClosingHour.mockResolvedValue(null)

        await scrapeEnergylandiaWaitingTimes(context)

        expect(mockedLogWarn).toHaveBeenCalledWith(
            'NO OPENING HOURS FOUND. HAVE NOT INSERTED ANY DATA',
        )
        expect(mockedInsertWaitingTimes).not.toHaveBeenCalled()
    })

    it('should log an error if scraping fails', async () => {
        mockedDataEntryToWaitingTime.mockReturnValue(mockMappedWaitingTime)
        mockedGetOpeningAndClosingHour.mockResolvedValue(mockOpeningHours)

        const error = new Error('Scraping failed')
        mockedAxios.post.mockRejectedValueOnce(error)

        await expect(scrapeEnergylandiaWaitingTimes(context)).rejects.toThrow(
            'Scraping failed',
        )

        expect(mockedLog).not.toHaveBeenCalledWith('SCRAPED WAITING TIME DATA!')
        expect(mockedDataEntryToWaitingTime).not.toHaveBeenCalled()
        expect(mockedInsertWaitingTimes).not.toHaveBeenCalled()
    })
})
