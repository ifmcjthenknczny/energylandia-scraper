import { Filter } from '@/types'
import { isFalsyExceptZero } from '@/utils/bool'

export function mapToSearchParamsObject({
    dayOfWeek,
    ...newFilter
}: Partial<Filter>) {
    return {
        ...newFilter,
        ...(!isFalsyExceptZero(dayOfWeek) && {
            dayOfWeek: dayOfWeek!.toString(),
        }),
    }
}
