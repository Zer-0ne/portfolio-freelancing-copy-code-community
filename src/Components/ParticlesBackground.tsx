'use client'
import React from 'react'
import Particles from 'react-particles'
import particleConfig from './Config/particles.config'
import { loadFull } from 'tsparticles'
import type { Engine } from "tsparticles-engine";

const ParticlesBackground = (
  {
    children
  }: {
    children: React.ReactNode,
  }
) => {
  const customInit = async (engine: Engine) => {
    // this adds the bundle to tsParticles
    await loadFull(engine);
  };
  return (
    <Particles
      id="tsparticles"
      options={particleConfig}
      init={customInit}
    >
      {children}
    </Particles>
  )
}

export default ParticlesBackground