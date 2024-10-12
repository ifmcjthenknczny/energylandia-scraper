"use client";

import React, { useEffect } from "react";

import Logo from "./components/misc/Logo";
import WaitingTimeChart from "./components/stats/AvgWaitingTimeByHourChart";
import { useFilter } from "./components/context/FilterContext";

export default function Home() {
  const {filter} = useFilter();
  useEffect(() => {
    
  }, [filter])
  console.log(filter)
  return (
    <>
    <Logo className='py-8 px-20' />
    <WaitingTimeChart />
    </>
  );
}
