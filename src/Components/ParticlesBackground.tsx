'use client'
import Image from 'next/image';
import React from 'react'
import Particles from 'react-particles'
import particleConfig from './Config/particles.config'
import { loadFull } from 'tsparticles'
import bg from '@/assests/1.gif'
import type { Engine, ISourceOptions } from "tsparticles-engine";

const ParticlesBackground = (
) => {
  const customInit = async (engine: Engine) => {
    // this adds the bundle to tsParticles
    await loadFull(engine);
  };
  return (
    <Particles
      id="tsparticles"
      options={particleConfig as ISourceOptions}
      init={customInit}
    />
    
  )
}

export default ParticlesBackground