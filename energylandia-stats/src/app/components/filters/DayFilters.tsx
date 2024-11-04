"use client";

import 'react-calendar/dist/Calendar.css';
import './DayFilters.css';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Calendar from 'react-calendar';
import { FIRST_DAY_OF_DATA } from './Filters';
import RemoveFilterButton from './RemoveFilterButton';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'
import { toDay } from '@/app/utils/date';
import utc from 'dayjs/plugin/utc'

dayjs.extend(timezone)
dayjs.extend(utc)

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Props {
  dayFrom: Date | null;
  dayTo: Date | null;
  onDayFromChange: (date: Date | null) => void;
  onDayToChange: (date: Date | null) => void;
}

const DayFilters= ({
  dayFrom,
  dayTo,
  onDayFromChange,
  onDayToChange,
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, onChange] = useState<Value>([dayFrom, dayTo]);

  const updateURL = (date: Value | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (Array.isArray(date)) {
      const [from, to] = date;
      if (!from || !to) {
        return;
      }
      console.log(from, to)
      current.set('dayFrom', toDay(dayjs(from).tz('Europe/Warsaw')));
      current.set('dayTo',  toDay(dayjs(to).tz('Europe/Warsaw')));
    } else if (!date) {
      current.delete('dayFrom');
      current.delete('dayTo');
    } else {
      current.set('dayFrom', toDay(dayjs(date).tz('Europe/Warsaw')));
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${query}`);
  };

  const handleChange = (value: Value | null) => {
    onChange(value);
    if (!value) {
      onDayFromChange(null);
      onDayToChange(null);
      updateURL(null);
      return;
    }
    if (Array.isArray(value)) {
      const [from, to] = value;
      onDayFromChange(from);
      onDayToChange(to);
      updateURL([from, to]);
    } else {
      onDayFromChange(value);
      onDayToChange(value);
      updateURL([value, new Date()])
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Calendar
        locale='en'
        onChange={handleChange}
        value={value}
        selectRange={true}
        className="rounded-md border border-gray-300 shadow-sm"
        minDate={new Date(FIRST_DAY_OF_DATA)}
        maxDate={new Date()}
      />
      <RemoveFilterButton paramsToRemove={['dayFrom', 'dayTo']} />
    </div>
  );
};

export default DayFilters;

