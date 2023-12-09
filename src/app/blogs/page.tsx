'use client'
import BlogCard from '@/Components/BlogCard'
import { Box, Container } from '@mui/material'
import React, { useState } from 'react'
import { styles } from '@/utils/styles';
import BlogEventsStructure from '@/Components/BlogEventsStructure';
import { blogsDetails } from '@/utils/constant';
const page = () => {
  const [searchInput, setSearchInput] = useState<string>('');

  const handleSearch = (input: string) => {
    setSearchInput(input);
  };

  // Filter events based on search input
  const filteredEvents = blogsDetails.filter(
    (item) =>
      item.heading.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.description.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.date.toLowerCase().includes(searchInput.toLowerCase())
  );
  return (
    <>
      <BlogEventsStructure
        placeholder='Search Blog...'
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
            filteredEvents.map((item, index) => (
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