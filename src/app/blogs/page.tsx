'use client'
import { Box, } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BlogsInterface, } from '@/utils/Interfaces';
import dynamic from 'next/dynamic';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';

const Loading = dynamic(() => import('@/Components/Loading'))
const BlogEventsStructure = dynamic(() => import('@/Components/BlogEventsStructure'))
const BlogCard = dynamic(() => import('@/Components/BlogCard'), { ssr: false })


const page = () => {
  const { blogs } = useSelector((state: RootState) => state.blogs)
  const dispatch = useDispatch<AppDispatch>()
  const blogRef = useRef(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true)
  const [pageNo, setPageNo] = useState<number>(1);
  const [isFetching, setIsFetching] = useState(false)

  // create observer of useRef 
  const observer = useRef<IntersectionObserver | null>(null)

  // create callback for lastElement of data 
  const lastElement = useCallback((node: Element) => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        console.log('Visible')
      }
    })
    if (node) observer.current?.observe(node)
  }, [isLoading])

  const handleSearch = (input: string) => {
    setSearchInput(input);
  };

  // fetch all the blogs
  const fetchData = async () => {
    try {
      const { fetchBlogs } = await import('@/slices/blogsSlice')
      setIsFetching(true)
      !blogs[0] && dispatch(fetchBlogs())

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
    return () => { blogRef.current = true }
  }, [])

  if (isLoading) return <Loading />

  // Filter events based on search window.addEventListener('scroll', handleScroll);input
  const filteredEvents = blogs[0]?.filter(
    (item: BlogsInterface) =>
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
            !blogs?.length ? <>
              No blog yet!
            </> :
              filteredEvents?.map((item: BlogsInterface, index: number) => (
                <Box
                  ref={(filteredEvents.length === index + 1) ? lastElement : undefined}
                >

                  <BlogCard
                    fetchData={fetchData}
                    key={index}
                    item={item}
                  />
                </Box>
              ))
          }
        </Box>
      </BlogEventsStructure>
    </>
  )
}

export default page