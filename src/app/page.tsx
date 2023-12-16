'use client'
import ParticlesBackground from '@/Components/ParticlesBackground'
import HomePage from '@/Pages/HomePage'
import { Box } from '@mui/material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <HomePage />
    </>
  )
}
