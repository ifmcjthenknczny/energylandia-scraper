"use client";

import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

import { useRouter, useSearchParams } from 'next/navigation';

import React from 'react';
import TimePicker from 'react-time-picker';

interface HourFiltersProps {
  hourFrom: string | null;
  hourTo: string | null;
  onHourFromChange: (hour: string | null) => void;
  onHourToChange: (hour: string | null) => void;
}

const TimeFilters: React.FC<HourFiltersProps> = ({
  hourFrom,
  hourTo,
  onHourFromChange,
  onHourToChange,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateURL = (param: string, value: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      current.set(param, value);
    } else {
      current.delete(param);
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${query}`);
  };

  const handleHourFromChange = (value: string | null) => {
    onHourFromChange(value);
    updateURL('hourFrom', value);
  };

  const handleHourToChange = (value: string | null) => {
    onHourToChange(value);
    updateURL('hourTo', value);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label htmlFor="hourFrom" className="block text-sm font-medium text-gray-700">
          From Hour
        </label>
        <TimePicker
          onChange={handleHourFromChange}
          value={hourFrom}
          clearIcon={null}
          className="mt-1 block w-full"
          disableClock={true}
        />
      </div>
      <div>
        <label htmlFor="hourTo" className="block text-sm font-medium text-gray-700">
          To Hour
        </label>
        <TimePicker
          onChange={handleHourToChange}
          value={hourTo}
          clearIcon={null}
          className="mt-1 block w-full"
          disableClock={true}
        />
      </div>
    </div>
  );
};

export default TimeFilters;
