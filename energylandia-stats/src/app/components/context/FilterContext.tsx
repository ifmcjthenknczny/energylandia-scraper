"use client";

import { Day, Hour, yesterday } from '@/app/utils/date';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation';

import { Filter } from '@/app/types';
import { removeUndefinedOrNull } from '@/app/utils/object';

const FIRST_DAY_OF_DATA: Day = '2024-10-05'

const defaultFilter: Filter = {
  dayFrom: FIRST_DAY_OF_DATA,
  dayTo: yesterday(),
  hourFrom: undefined,
  hourTo: undefined,
  dayOfWeek: undefined
};

const FilterContext = createContext<{
  filter: Filter;
  setFilter: (filterDiff: Partial<Filter>) => void;
} | undefined>(undefined);

export function mapToSearchParamsObject({dayOfWeek, ...newFilter}: Partial<Filter>) {
  return {
    ...newFilter,
    ...(dayOfWeek && {dayOfWeek: dayOfWeek.toString()})
  }
}

export function mapQueryToFilter(query?: ReadonlyURLSearchParams): Partial<Filter> {
  if (!query) {
    return defaultFilter;
  }

  return removeUndefinedOrNull({
    dayFrom: query.get('dayFrom') as Day | undefined,
    dayTo: query.get('dayTo') as Day | undefined,
    hourFrom: query.get('hourFrom') as Hour | undefined,
    hourTo: query.get('hourTo') as Hour | undefined,
    dayOfWeek: query.get('dayOfWeek') ? parseInt(query.get('dayOfWeek')!) : undefined,
  });
}

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const query = useSearchParams();
  const [filter, setFilter] = useState<Filter>(defaultFilter);

  function handleSetFilter(filterDiff: Partial<Filter>) {
    const newFilter = removeUndefinedOrNull({ ...filter, ...filterDiff });
    setFilter(newFilter);
    const searchParamsObject = mapToSearchParamsObject(newFilter)
    router.push(new URLSearchParams(searchParamsObject).toString());
  }
  
  useEffect(() => {
    const newFilter = mapQueryToFilter(query)
    setFilter(newFilter)
  }, [])

  return (
    <FilterContext.Provider value={{ filter, setFilter: handleSetFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
