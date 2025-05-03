'use client'
import { Box, } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BlogsInterface, } from '@/utils/Interfaces';
import dynamic from 'next/dynamic';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';

const Loading = dynamic(() => import('@/components/Loading'))
const BlogEventsStructure = dynamic(() => import('@/components/BlogEventsStructure'))
const BlogCard = dynamic(() => import('@/components/BlogCard'), { ssr: false })


const page = () => {
  const { blogs,loading } = useSelector((state: RootState) => state.blogs)
  const dispatch = useDispatch<AppDispatch>()
  const [searchInput, setSearchInput] = useState<string>('');
  const [pageNo, setPageNo] = useState<number>(1);

  // create observer of useRef 
  const observer = useRef<IntersectionObserver | null>(null)

  // create callback for lastElement of data 
  const lastElement = useCallback((node: Element) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        // console.log('Visible')
      }
    })
    if (node) observer.current?.observe(node)
  }, [loading])

  const handleSearch = (input: string) => {
    setSearchInput(input);
  };

  // fetch all the blogs
  const fetchData = async () => {
    try {
      const { fetchBlogs } = await import('@/slices/blogsSlice')
      !blogs.length && dispatch(fetchBlogs())
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect
  useEffect(() => {
    fetchData();
  }, [])

  if (loading) return <Loading />

  // Filter events based on search window.addEventListener('scroll', handleScroll);input
  const filteredEvents = blogs && blogs?.filter(
    (item: BlogsInterface) =>
      item?.title?.toLowerCase().includes(searchInput?.toLowerCase()) ||
      item?.tag?.toLowerCase().includes(searchInput?.toLowerCase()) ||
      item?.description?.toLowerCase().includes(searchInput?.toLowerCase()) ||
      item?.updatedAt?.toLowerCase().includes(searchInput?.toLowerCase())
  );

  // console.log(blogs)

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
            (!blogs?.length && !loading) ? <>
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