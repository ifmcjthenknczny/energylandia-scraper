"use client";

import Logo from "./components/misc/Logo";
import React from "react";
import SuspensedDataWrapper from "./components/DataWrapper";

export default function Home() {  
  return (
    <>
    <Logo className='py-8 px-20' />
    <SuspensedDataWrapper />
    </>
  );
}
