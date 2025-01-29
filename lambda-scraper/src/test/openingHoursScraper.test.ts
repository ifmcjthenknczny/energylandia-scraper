import { Day, Hour } from '../helpers/util/date'

import { ScriptContext } from '../context'
import axios from 'axios'
import { insertOpeningHours } from '../client/openingHours'
import { log } from '../helpers/util/log'
import { responseToOpeningHours } from '../helpers/mapper'
import { scrapeEnergylandiaOpeningHours } from '../scrapers/openingHoursScraper'

jest.mock('axios')
jest.mock('../client/openingHours')
jest.mock('../helpers/util/log')
jest.mock('../helpers/mapper')

const mockedAxios = axios as jest.Mocked<typeof axios>
const mockedInsertOpeningHours = insertOpeningHours as jest.MockedFunction<
    typeof insertOpeningHours
>
const mockedLog = log as jest.MockedFunction<typeof log>
const mockedResponseToOpeningHours =
    responseToOpeningHours as jest.MockedFunction<typeof responseToOpeningHours>

describe('scrapeEnergylandiaOpeningHours', () => {
    const context: ScriptContext = {
        executionId: 'test',
        // eslint-disable-next-line
        db: {} as any,
        now: new Date(),
    }

    const mockScrapedOpeningHours = {
        '2024-10-05': {
            date: '2024-10-05',
            data: '2024-10-05',
            title: 'Open',
            color: '#FFFFFF',
            birthdays: { '': 'None' },
            status: 'otwarte',
            time_od: '09:00',
            time_do: '18:00',
        },
    }

    const mockMappedOpeningHour = {
        date: '2024-10-05' as Day,
        openingHour: '09:00' as Hour,
        closingHour: '18:00' as Hour,
        isOpen: true,
        scrapedAt: new Date(),
    }

    beforeEach(() => {
        mockedAxios.post.mockResolvedValue({ data: mockScrapedOpeningHours })
        mockedResponseToOpeningHours.mockReturnValue(mockMappedOpeningHour)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should scrape, map, and insert opening hours', async () => {
        await scrapeEnergylandiaOpeningHours(context)

        expect(mockedAxios.post).toHaveBeenCalledWith(expect.any(String))
        expect(mockedLog).toHaveBeenCalledWith('SCRAPED OPENING HOUR DATA!')
        expect(mockedResponseToOpeningHours).toHaveBeenCalledWith(
            mockScrapedOpeningHours,
            context.now,
        )
        expect(mockedLog).toHaveBeenCalledWith('MAPPED OPENING HOUR DATA!')
        expect(mockedInsertOpeningHours).toHaveBeenCalledWith(
            context.db,
            mockMappedOpeningHour,
        )
        expect(mockedLog).toHaveBeenCalledWith(
            'INSERTED OPENING HOUR DATA INTO DB',
        )
    })

    it('should log an error if scraping fails', async () => {
        const error = new Error('Scraping failed')
        mockedAxios.post.mockRejectedValueOnce(error)

        await expect(scrapeEnergylandiaOpeningHours(context)).rejects.toThrow(
            'Scraping failed',
        )

        expect(mockedLog).not.toHaveBeenCalledWith('SCRAPED OPENING HOUR DATA!')
        expect(mockedResponseToOpeningHours).not.toHaveBeenCalled()
        expect(mockedInsertOpeningHours).not.toHaveBeenCalled()
    })
})
