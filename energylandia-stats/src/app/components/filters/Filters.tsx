"use client";

import React, { useEffect, useState } from 'react';

import DayFilters from './DayFilters';
import DayOfWeekFilter from './DayOfWeekFilter';
import TimeFilters from './TimeFilters';
import { useSearchParams } from 'next/navigation';

export const FIRST_DAY_OF_DATA = '2023-04-01';

const Filters: React.FC = () => {
  const searchParams = useSearchParams();
  const [dayFrom, setDayFrom] = useState<Date | null>(null);
  const [dayTo, setDayTo] = useState<Date | null>(null);
  const [dayOfWeek, setDayOfWeek] = useState<number | null>(null);
  const [hourFrom, setHourFrom] = useState<string | null>(null);
  const [hourTo, setHourTo] = useState<string | null>(null);

  useEffect(() => {
    const dayFromParam = searchParams.get('dayFrom');
    const dayToParam = searchParams.get('dayTo');
    const dayOfWeekParam = searchParams.get('dayOfWeek');
    const hourFromParam = searchParams.get('hourFrom');
    const hourToParam = searchParams.get('hourTo');

    setDayFrom(dayFromParam ? new Date(dayFromParam) : null);
    setDayTo(dayToParam ? new Date(dayToParam) : null);
    setDayOfWeek(dayOfWeekParam ? parseInt(dayOfWeekParam, 10) : null);
    setHourFrom(hourFromParam);
    setHourTo(hourToParam);
  }, [searchParams]);

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Filters</h2>
      <div className="flex flex-col space-y-4">
        <DayFilters
          dayFrom={dayFrom}
          dayTo={dayTo}
          onDayFromChange={setDayFrom}
          onDayToChange={setDayTo}
        />
        <DayOfWeekFilter
          dayOfWeek={dayOfWeek}
          onDayOfWeekChange={setDayOfWeek}
        />
        <TimeFilters
          hourFrom={hourFrom}
          hourTo={hourTo}
          onHourFromChange={setHourFrom}
          onHourToChange={setHourTo}
        />
      </div>
    </div>
  );
};

export default Filters;
// "use client";

// import { Day, Hour, yesterday } from '@/app/utils/date';
// import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
// import { ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation';

// import { Filter } from '@/app/types';
// import { removeUndefinedOrNull } from '@/app/utils/object';


// const defaultFilter: Filter = {
//   dayFrom: FIRST_DAY_OF_DATA,
//   dayTo: yesterday(),
//   hourFrom: undefined,
//   hourTo: undefined,
//   dayOfWeek: undefined
// };

// const FilterContext = createContext<{
//   filter: Filter;
//   setFilter: (filterDiff: Partial<Filter>) => void;
// } | undefined>(undefined);

// export function mapQueryToFilter(query?: ReadonlyURLSearchParams): Partial<Filter> {
//   if (!query) {
//     return defaultFilter;
//   }

//   return removeUndefinedOrNull({
//     dayFrom: query.get('dayFrom') as Day | undefined,
//     dayTo: query.get('dayTo') as Day | undefined,
//     hourFrom: query.get('hourFrom') as Hour | undefined,
//     hourTo: query.get('hourTo') as Hour | undefined,
//     dayOfWeek: query.get('dayOfWeek') ? parseInt(query.get('dayOfWeek')!) : undefined,
//   });
// }

// export const FilterProvider = ({ children }: { children: ReactNode }) => {
//   const router = useRouter()
//   const query = useSearchParams();
//   const [filter, setFilter] = useState<Filter>(defaultFilter);

//   function handleSetFilter(filterDiff: Partial<Filter>) {
//     const newFilter = removeUndefinedOrNull({ ...filter, ...filterDiff });
//     setFilter(newFilter);
//     const searchParamsObject = mapToSearchParamsObject(newFilter)
//     router.push(new URLSearchParams(searchParamsObject).toString());
//   }
  
//   useEffect(() => {
//     const newFilter = mapQueryToFilter(query)
//     setFilter(newFilter)
//   }, [])

//   return (
//     <FilterContext.Provider value={{ filter, setFilter: handleSetFilter }}>
//       {children}
//     </FilterContext.Provider>
//   );
// };

// export const useFilter = () => {
//   const context = useContext(FilterContext);
//   if (!context) {
//     throw new Error('useFilter must be used within a FilterProvider');
//   }
//   return context;
// };

