import BlogEventsStructure from '@/Components/BlogEventsStructure'
import EventCard from '@/Components/EventCard'
import { styles } from '@/utils/styles'
import { Box, Container } from '@mui/material'
import React from 'react'

const page = () => {
  return (
    <>
      <BlogEventsStructure
        placeholder='Search event...'
        btnText='Search'
      >
        {
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
            <EventCard
              key={index}
            />
          ))
        }
      </BlogEventsStructure>
    </>
  )
}

export default page