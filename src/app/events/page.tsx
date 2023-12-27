'use client'
import BlogEventsStructure from '@/Components/BlogEventsStructure'
import EventCard from '@/Components/EventCard'
import Loading from '@/Components/Loading'
import { fetchSession } from '@/slices/sessionSlice'
import { AppDispatch } from '@/store/store'
import { allPost } from '@/utils/FetchFromApi'
import { EventsInterface, Session } from '@/utils/Interfaces'
import { currentSession } from '@/utils/Session'
import { Box } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

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