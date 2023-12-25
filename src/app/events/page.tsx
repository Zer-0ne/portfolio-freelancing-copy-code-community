'use client'
import BlogEventsStructure from '@/Components/BlogEventsStructure'
import EventCard from '@/Components/EventCard'
import Loading from '@/Components/Loading'
import { allPost } from '@/utils/FetchFromApi'
import { EventsInterface, Session } from '@/utils/Interfaces'
import { currentSession } from '@/utils/Session'
import { Box } from '@mui/material'
import React, { useState } from 'react'

const page = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [data, setData] = useState<EventsInterface[]>()
  const [session, setSession] = useState<Session>()
  const [isLoading, setIsLoading] = useState(true)


  const handleSearch = (input: string) => {
    setSearchInput(input);
  };

  // fetch all the events
  const fetchData = async () => {
    try {
      const fetchedData: EventsInterface[] = await allPost('event');
      const session = await currentSession()
      setSession(session as Session)
      setData(fetchedData)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }


  // useEffect
  React.useEffect(() => {
    fetchData()
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
        session={session as Session}
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
                  session={session as Session}
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