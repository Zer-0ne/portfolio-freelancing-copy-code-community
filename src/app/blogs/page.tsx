'use client'
import BlogCard from '@/Components/BlogCard'
import { Box, Container } from '@mui/material'
import React, { useState } from 'react'
import { styles } from '@/utils/styles';
import BlogEventsStructure from '@/Components/BlogEventsStructure';
import { blogsDetails } from '@/utils/constant';
import { allBlog } from '@/utils/FetchFromApi';
import { BlogsInterface } from '@/utils/Interfaces';

const page = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [data, setData] = useState<BlogsInterface[]>([])

  const handleSearch = (input: string) => {
    setSearchInput(input);
  };

  // fetch all the blogs
  const fetchData = async () => {
    try {
      const fetchedData: BlogsInterface[] = await allBlog();
      setData(fetchedData)
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect
  React.useEffect(() => {
    fetchData()
  }, [])

  console.log(data)

  // Filter events based on search input
  const filteredEvents = data?.filter(
    (item) =>
      item.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.description.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.date.toLowerCase().includes(searchInput.toLowerCase())
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
            flexDirection: 'column'
          }}
        >
          {
            filteredEvents?.map((item, index) => (
              <BlogCard
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