"use client";

import 'react-calendar/dist/Calendar.css';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Calendar from 'react-calendar';
import { FIRST_DAY_OF_DATA } from './Filters';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface DayFiltersProps {
  dayFrom: Date | null;
  dayTo: Date | null;
  onDayFromChange: (date: Date | null) => void;
  onDayToChange: (date: Date | null) => void;
}

const DayFilters: React.FC<DayFiltersProps> = ({
  dayFrom,
  dayTo,
  onDayFromChange,
  onDayToChange,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, onChange] = useState<Value>([dayFrom, dayTo]);

  const updateURL = (param: string, date: Date | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (date) {
      current.set(param, date.toISOString().split('T')[0]);
    } else {
      current.delete(param);
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${query}`);
  };

  const handleChange = (value: Value) => {
    onChange(value);
    console.log(value)
    if (Array.isArray(value)) {
      const [from, to] = value;
      onDayFromChange(from);
      onDayToChange(to);
      updateURL('dayFrom', from);
      updateURL('dayTo', to);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Calendar
        onChange={handleChange}
        value={value}
        selectRange={true}
        className="rounded-md border border-gray-300 shadow-sm"
        minDate={new Date(FIRST_DAY_OF_DATA)}
        maxDate={new Date()}
      />
    </div>
  );
};

export default DayFilters;

