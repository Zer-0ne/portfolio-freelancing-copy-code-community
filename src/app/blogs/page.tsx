import BlogCard from '@/Components/BlogCard'
import { Box, Container } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles';
import BlogEventsStructure from '@/Components/BlogEventsStructure';
const page = () => {
  return (
    <>
      <BlogEventsStructure
        placeholder='Search Blog...'
        btnText='New'
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
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
              <BlogCard
                key={index}
              />
            ))
          }
        </Box>
      </BlogEventsStructure>
    </>
  )
}

export default page