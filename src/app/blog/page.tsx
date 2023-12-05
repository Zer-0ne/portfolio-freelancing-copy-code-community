import BlogCard from '@/Components/BlogCard'
import { Box, Container } from '@mui/material'
import React from 'react'

const page = () => {
  return (
    <>
      <Box>
        <Container
          sx={{
            mt: 3,
            gap: 5,
            display: 'flex',
            flexDirection: 'column'
            , marginBottom: 7
          }}
        >

          {/* search bar and new btn */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 3
            }}
          >
            <input
              placeholder='Search Blog...'
              style={{
                flex: 8,
                background: 'transparent'
                , border: '1px solid rgba(255,255,255,.25)'
                , borderRadius: 5
                , padding: '7px 10px'
              }}
            />
            <button
              style={{
                background: 'green',
                padding: '5px 20px',
                borderRadius: 4,
                flex: 1
              }}
            >New</button>
          </Box>

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
        </Container>
      </Box>
    </>
  )
}

export default page