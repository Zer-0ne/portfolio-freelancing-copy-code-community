import BlogEventsStructure from '@/Components/BlogEventsStructure'
import EventCard from '@/Components/EventCard'
import { eventsDetails } from '@/utils/constant'
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
          eventsDetails.map((item, index) => (
            <EventCard
              key={index}
              item={item}
            />
          ))
        }
      </BlogEventsStructure>
    </>
  )
}

export default page