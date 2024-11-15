'use client'
import React from 'react'
import particleConfig from './Config/particles.config'
import { loadFull } from 'tsparticles'
import type {  Engine, ISourceOptions } from "tsparticles-engine";
import dynamic from 'next/dynamic';

const Particles = dynamic(() => import('react-particles'))


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