'use client'
import dynamic from 'next/dynamic'

// dynamic imports
const ParticlesBackground = dynamic(() => import('@/components/ParticlesBackground'))
const HomePage = dynamic(() => import('@/Pages/HomePage'))

export default function Home() {
  return (
    <>
      <ParticlesBackground />
      <HomePage />
    </>
  )
}
