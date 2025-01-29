import { Filter } from '../types'

export function buildFilter(filter?: Filter) {
    const dayFilter =
        filter?.dayFrom || filter?.dayTo
            ? {
                  date: {
                      ...(filter?.dayFrom && { $gte: filter.dayFrom }),
                      ...(filter?.dayTo && { $lte: filter.dayTo }),
                  },
              }
            : {}

    const hourFilter =
        filter?.hourFrom || filter?.hourTo
            ? {
                  time: {
                      ...(filter?.hourFrom && { $gte: filter.hourFrom }),
                      ...(filter?.hourTo && { $lte: filter.hourTo }),
                  },
              }
            : {}

    const dayOfWeekFilter =
        filter?.dayOfWeek !== undefined ? { dayOfWeek: filter.dayOfWeek } : {}

    return {
        ...dayFilter,
        ...hourFilter,
        ...dayOfWeekFilter,
    }
}
