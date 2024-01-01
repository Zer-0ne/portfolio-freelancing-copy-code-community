import { CommentInterface } from '@/utils/Interfaces'
import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'

const CommentItem = (
  {
    data
  }: {
    data: CommentInterface
  }
) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
      }}
    >
      <Avatar
        src={data.authorId.image}
      />
      <Typography
        sx={{
          ...styles.customInput(0, {
            borderRadius: 2,
            minWidth: 200,
            maxHeight: 100,
            display: 'flex',
            alignItem: 'center',
            fontSize: 16,
            opacity: 0.8
          })
        }}
        variant='caption'
      >{data.comment}</Typography>
    </Box>
  )
}

export default CommentItem