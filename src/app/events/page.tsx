'use client'

import { AppDispatch } from '@/store/store'
import { EventsInterface } from '@/utils/Interfaces'
import { Box } from '@mui/material'
import dynamic from 'next/dynamic'
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

const Loading = dynamic(() => import('@/Components/Loading'))
const EventCard = dynamic(() => import('@/Components/EventCard'))
const BlogEventsStructure = dynamic(() => import('@/Components/BlogEventsStructure'))


const page = () => {
  const pageRef = useRef(false)
  const [searchInput, setSearchInput] = useState<string>('');
  const [data, setData] = useState<EventsInterface[]>()
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(true)


  const handleSearch = (input: string) => {
    setSearchInput(input);
  };

  // fetch all the events
  const fetchData = async () => {
    try {
      const { fetchSession } = await import('@/slices/sessionSlice')
      const { allPost } = await import('@/utils/FetchFromApi')

      const fetchedData: EventsInterface[] = await allPost('event');

      // fetch session from the redux store 
      dispatch(fetchSession());

      setData(fetchedData)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }


  // useEffect
  React.useEffect(() => {
    (pageRef.current === false) && fetchData()
    return () => {
      pageRef.current = true
    }
  }, [])


  if (isLoading) return <Loading />

  // Filter events based on search input
  const filteredEvents = data?.filter(
    (item) =>
      item.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.description.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.eventDate.toLowerCase().includes(searchInput.toLowerCase()) ||
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
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'column-reverse'
          }}
        >

          {
            !data?.length ? <>
              No Events Yet!
            </> :
              filteredEvents?.map((item, index) => (
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