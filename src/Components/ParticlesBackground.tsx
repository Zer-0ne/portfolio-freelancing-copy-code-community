'use client'
import Image from 'next/image';
import React from 'react'
// import Particles from 'react-particles'
// import particleConfig from './Config/particles.config'
import { loadFull } from 'tsparticles'
import type { Engine, ISourceOptions } from "tsparticles-engine";

const ParticlesBackground = (
) => {
  const customInit = async (engine: Engine) => {
    // this adds the bundle to tsParticles
    await loadFull(engine);
  };
  return (
    // <Particles
    //   id="tsparticles"
    //   options={particleConfig as ISourceOptions}
    //   init={customInit}
    // />
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        {/* Replace 'your_video.mp4' with the path or URL of your video */}
        <video autoPlay muted loop style={{ width: '100%', height: '100%' }}>
          <source src={`https://drive.google.com/file/d/11UHvcP48uIwkUOMrodrxbb639-hd9P13/view?usp=sharing`} type="video/mp4" />
        </video>
      </div>
      <style jsx>{`
        @media screen and (max-width: 600px) {
          video {
            transform: scale(3.5); // Adjust the zoom level as needed
          }
        }
        @media screen and (max-width: 1200px) {
          video {
            transform: scale(5.5); // Adjust the zoom level as needed
          }
        }
        @media screen and (min-width: 1200px) {
          video {
            transform: scale(1.5); // Adjust the zoom level as needed
          }
        }
      `}</style>
      {/* <video
        preload="auto"
        playsInline
        autoPlay
        muted
        loop
        style={{ zIndex: -1, position: 'absolute', inset: 0 }}
      >
        <source
          src={`https://firebasestorage.googleapis.com/v0/b/copycodecommunity-a082f.appspot.com/o/bg%2FbgVideo.mp4?alt=media&token=013cb9fc-0fc3-4aaa-bea9-18f7a522a3c7`}
        /> */}
      {/* </video> */}
    </>
  )
}

export default ParticlesBackground