import { Filter } from '@/app/types'
import { isFalsyExceptZero } from '@/app/utils/bool'

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
