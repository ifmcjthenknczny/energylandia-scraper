import React, {useEffect, useState} from 'react'
import { mapToSearchParamsObject, useFilter } from '../context/FilterContext';

import { AvgTimeByHourResponse } from '@/app/types';
import {Chart} from 'react-google-charts';
import axios from 'axios';

const WaitingTimeChart = () => {
    const [selectedAttractions, setSelectedAttractions] = useState<string[]>([]);
    const [data, setData] = useState<AvgTimeByHourResponse>()
    const { filter } = useFilter();

    useEffect(() => {
        const fetchAndPrepareData = async () => {
          const query = new URLSearchParams(mapToSearchParamsObject(filter)).toString();
            const response = await axios.get<AvgTimeByHourResponse>(`/api/stats/by-hour?${query}`);
            setData(response.data);
        };
        fetchAndPrepareData()
    }, [filter])
  
    const handleAttractionChange = (attraction: string) => {
      setSelectedAttractions((prev) => 
        prev.includes(attraction)
          ? prev.filter((name) => name !== attraction)
          : [...prev, attraction]
      );
    };
  
    const prepareChartData = () => {
        if (!data) {
            return
        }
      const chartData: Array<[string, ...string[]]> = [['Hour', ...selectedAttractions]];
  
      const hours = Object.keys(data[selectedAttractions[0] || ''] || {});
  
      hours.forEach((hour) => {
        const row: [string, ...number[]] = [hour];
        selectedAttractions.forEach((attraction) => {
          row.push(data[attraction][hour] || 0);
        });
        chartData.push(row);
      });
  
      return chartData;
    };
  
    const chartData = prepareChartData();
  
    return (
      <div className='pb-6'>
        <h1 className="text-xl my-4 text-center">Waiting Time by Attraction</h1>
        <div className="flex flex-row">
        <div className='flex flex-col gap-1 max-h-[400px] overflow-y-scroll text-xs mx-2 p-2 border border-2'>
          {!!data && Object.keys(data).map((attractionName) => (
            <label key={attractionName}>
              <input
              className='mr-1'
                type="checkbox"
                checked={selectedAttractions.includes(attractionName)}
                onChange={() => handleAttractionChange(attractionName)}
              />
              {attractionName}
            </label>
          ))}
        </div>
        {selectedAttractions.length > 0 && (
          <Chart
            width={'100%'}
            height={'400px'}
            className='pr-2'
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={chartData}
            options={{
              hAxis: {
                title: 'Hour',
                minValue: 0
              },
              vAxis: {
                title: 'Waiting Time (minutes)',
                minValue: 0
              },
              series: selectedAttractions.reduce((acc, name, index) => {
                acc[index] = { curveType: 'function' };
                return acc;
              }, {} as Record<number, { curveType: string }>),
              legend: { position: 'right' },
            }}
          />
        )}
        </div>
      </div>
    );
  };
  
  export default WaitingTimeChart;