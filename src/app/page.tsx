'use client'
import { DrawerDialogDemo } from '@/components/dev-card';
import dynamic from 'next/dynamic'
import * as React from "react";

// Dynamic imports
const ParticlesBackground = dynamic(() => import('@/components/ParticlesBackground'))
const HomePage = dynamic(() => import('@/Pages/HomePage'))



// Main Home Component with fixed positioning
export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Layer */}
      {/* <div className="absolute inset-0 z-0"> */}
      <ParticlesBackground />
      {/* </div> */}

      {/* Main Content Layer */}
      {/* <div className="absolute inset-0 z-10"> */}
      <HomePage />
      {/* </div> */}

      {/* Floating Action Button Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <DrawerDialogDemo />
        </div>
      </div>

    </div>
  )
}