'use client'
import BlogEventsStructure from '@/Components/BlogEventsStructure'
import EventCard from '@/Components/EventCard'
import { allEvent } from '@/utils/FetchFromApi'
import { EventsInterface } from '@/utils/Interfaces'
import { eventsDetails } from '@/utils/constant'
import { styles } from '@/utils/styles'
import { Box, Container } from '@mui/material'
import React, { useState } from 'react'

const page = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [data, setData] = useState<EventsInterface[]>([])

  const handleSearch = (input: string) => {
    setSearchInput(input);
  };

  // fetch all the events
  const fetchData = async () => {
    try {
      const fetchedData: EventsInterface[] = await allEvent();
      setData(fetchedData)
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect
  React.useEffect(() => {
    fetchData()
  }, [])

  // Filter events based on search input
  const filteredEvents = eventsDetails?.filter(
    (item) =>
      item.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.description.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.calenderDate.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.status.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.headingDate.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.mode.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.label?.toLowerCase().includes(searchInput.toLowerCase())
  );
  return (
    <>
      <BlogEventsStructure
        from='event'
        placeholder='Search event...'
        btnText='New'
        searchInput={searchInput}
        handleSearch={handleSearch}
      >
        {
          filteredEvents?.map((item, index) => (
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