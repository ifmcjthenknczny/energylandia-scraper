"use client";

import { useRouter, useSearchParams } from 'next/navigation';

import React from 'react';

interface DayOfWeekFilterProps {
  dayOfWeek: number | null;
  onDayOfWeekChange: (dayOfWeek: number | null) => void;
}

const daysOfWeek = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const DayOfWeekFilter: React.FC<DayOfWeekFilterProps> = ({
  dayOfWeek,
  onDayOfWeekChange,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const newDayOfWeek = value === '' ? null : parseInt(value, 10);
    onDayOfWeekChange(newDayOfWeek);
    updateURL(newDayOfWeek);
  };

  const updateURL = (dayOfWeek: number | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (dayOfWeek !== null) {
      current.set('dayOfWeek', dayOfWeek.toString());
    } else {
      current.delete('dayOfWeek');
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${query}`);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="dayOfWeek" className="text-sm font-medium text-gray-700">
        Day of Week
      </label>
      <select
        id="dayOfWeek"
        value={dayOfWeek === null ? '' : dayOfWeek}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option value="">All days</option>
        {daysOfWeek.map((day) => (
          <option key={day.value} value={day.value}>
            {day.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DayOfWeekFilter;

