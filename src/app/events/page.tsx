'use client'
import BlogEventsStructure from '@/Components/BlogEventsStructure'
import EventCard from '@/Components/EventCard'
import Loading from '@/Components/Loading'
import { allPost } from '@/utils/FetchFromApi'
import { EventsInterface } from '@/utils/Interfaces'
import React, { useState } from 'react'

const page = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [data, setData] = useState<EventsInterface[]>()
  const [isLoading, setIsLoading] = useState(true)


  const handleSearch = (input: string) => {
    setSearchInput(input);
  };

  // fetch all the events
  const fetchData = async () => {
    try {
      const fetchedData: EventsInterface[] = await allPost('event');
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
  console.log(data)

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
      </BlogEventsStructure>
    </>
  )
}

export default page