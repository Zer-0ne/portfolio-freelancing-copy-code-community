'use client'
import { Box, } from '@mui/material'
import React, { useRef, useState } from 'react'
import { BlogsInterface, } from '@/utils/Interfaces';
import dynamic from 'next/dynamic';

const Loading = dynamic(() => import('@/Components/Loading'))
const BlogEventsStructure = dynamic(() => import('@/Components/BlogEventsStructure'))
const BlogCard = dynamic(() => import('@/Components/BlogCard'))


const page = () => {
  const blogRef = useRef(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [data, setData] = useState<BlogsInterface[]>()
  const [pageCount, setPageCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true)



  const handleSearch = (input: string) => {
    setSearchInput(input);
  };

  // fetch all the blogs
  const fetchData = async () => {
    try {
      const { allPost } = await import('@/utils/FetchFromApi')
      const fetchedData: BlogsInterface[] = await allPost('blog');

      setData(fetchedData)
      setIsLoading(false)

      setPageCount(prevPage => prevPage + 1);
    } catch (error) {
      console.log(error)
    }
  }



  // useEffect
  React.useEffect(() => {
    (blogRef.current === false) && fetchData()
    return () => { blogRef.current = true }
  }, [])

  if (isLoading) return <Loading />

  // Filter events based on search window.addEventListener('scroll', handleScroll);input
  const filteredEvents = data?.filter(
    (item) =>
      item?.title?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.tag?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.description?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.updatedAt?.toLowerCase().includes(searchInput.toLowerCase())
  );


  console.log(pageCount)

  return (
    <>
      <BlogEventsStructure
        placeholder='Search Blog...'
        from='blog'
        btnText='New'
        handleSearch={handleSearch}
        searchInput={searchInput}
      >

        {/* blogs */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'column-reverse'
          }}
        >
          {
            !data?.length ? <>
              No blog yet!
            </> :
              filteredEvents?.map((item, index) => (
                <BlogCard
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