'use client'

import { fetchEvents } from '@/slices/eventsSlice'
import { AppDispatch, RootState } from '@/store/store'
import { EventsInterface } from '@/utils/Interfaces'
import { Box } from '@mui/material'
import dynamic from 'next/dynamic'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Loading = dynamic(() => import('@/components/Loading'))
const EventCard = dynamic(() => import('@/components/EventCard'))
const BlogEventsStructure = dynamic(() => import('@/components/BlogEventsStructure'))


const page = () => {
  const { events,loading } = useSelector((state: RootState) => state.events)
  const dispatch = useDispatch<AppDispatch>()
  const [searchInput, setSearchInput] = useState<string>('');


  const handleSearch = (input: string) => {
    setSearchInput(input);
  };

  // fetch all the events
  const fetchData = async () => {
    try {
      !events.length && dispatch(fetchEvents())
    } catch (error) {
      console.log(error)
    }
  }


  // useEffect
  React.useEffect(() => {
    fetchData()
  }, [])


  if (loading) return <Loading />

  // Filter events based on search input
  const filteredEvents = events?.filter(
    (item: EventsInterface) =>
      item?.title?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.tag?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.description?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.eventDate?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.status?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.headingDate?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.mode?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.label?.toLowerCase().includes(searchInput.toLowerCase())
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
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'column-reverse'
          }}
        >

          {
            (!events?.length && !loading) ? <>
              No Events Yet!
            </> :
              filteredEvents?.map((item: EventsInterface, index: number) => (
                <EventCard
                  fetchData={fetchData}
                  key={index}
                  item={item}
                />
              ))
          }
        </Box>
      </BlogEventsStructure>
    </>
  )
}

export default page