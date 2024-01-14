'use client'
import { Box, } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { BlogsInterface, } from '@/utils/Interfaces';
import dynamic from 'next/dynamic';

const Loading = dynamic(() => import('@/Components/Loading'))
const BlogEventsStructure = dynamic(() => import('@/Components/BlogEventsStructure'))
const BlogCard = dynamic(() => import('@/Components/BlogCard'), { ssr: false })


const page = () => {
  const blogRef = useRef(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [data, setData] = useState<BlogsInterface[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [pageNo, setPageNo] = useState<number>(1);
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (isFetching) return
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      const scrollPositionFromBottom = documentHeight - (scrollY + windowHeight);

      // Set your threshold here (e.g., 1100px from the bottom)
      const threshold = documentHeight - 250;
      console.log(scrollY, scrollPositionFromBottom, documentHeight, scrollY === 101, threshold)

      if (scrollPositionFromBottom === 0) {
        // Increment pageNo when the scroll position is within the threshold
        setPageNo((prevPageNo) => prevPageNo + 1);
      }
      if (scrollY === 0) {
        // Decrement pageNo when the scroll position is within the threshold
        setPageNo((prevPageNo) => prevPageNo - 1);
      }
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (input: string) => {
    setSearchInput(input);
  };

  // fetch all the blogs
  const fetchData = async () => {
    try {
      const { allPost } = await import('@/utils/FetchFromApi')
      setIsFetching(true)
      const fetchedData: BlogsInterface[] = await allPost(`blog`);

      setData(fetchedData)
      setIsFetching(false)
      setIsLoading(false)
    } catch (error) {
      setIsFetching(false)
      console.log(error)
    }
  }

  // useEffect
  React.useEffect(() => {
    if (blogRef.current === false) fetchData();
    return () => { blogRef.current = false }
  }, [])

  // React.useEffect(() => {
  //   return () => {
  //     blogRef.current = true;
  //   };
  // }, []);

  if (isLoading) return <Loading />

  // Filter events based on search window.addEventListener('scroll', handleScroll);input
  const filteredEvents = data?.filter(
    (item) =>
      item?.title?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.tag?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.description?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.updatedAt?.toLowerCase().includes(searchInput.toLowerCase())
  );


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