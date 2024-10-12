import { Filter } from "@/app/types"

export function mapToSearchParamsObject({dayOfWeek, ...newFilter}: Partial<Filter>) {
  return {
    ...newFilter,
    ...(dayOfWeek && {dayOfWeek: dayOfWeek.toString()})
  }
}