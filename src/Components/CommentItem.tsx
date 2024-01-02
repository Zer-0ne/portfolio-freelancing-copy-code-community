import { CommentInterface } from '@/utils/Interfaces'
import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import { Delete } from '@mui/icons-material'
import { deleteComment } from '@/utils/FetchFromApi'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'

const CommentItem = (
  {
    data,
    fetchedData
  }: {
    data: CommentInterface;
    fetchedData: () => Promise<void>
  }
) => {
  const { session } = useSelector((state: RootState) => state.session)
  const handleDelete = async () => {
    try {
      return await deleteComment(data._id, data.authorId._id)
      await fetchedData()
    } catch (error) {
      console.log(error)
    }
  }
  // console.log(session.length)
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        alignItems: 'center'
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
      {
        // (!session[0] || session[0]?.role !== 'admin' || session[0]?._id !== data.authorId.id) ? <></> :
        <Delete
          onClick={handleDelete}
          sx={{
            color: 'red',
            opacity: 0.8,
            cursor: 'pointer',
            display: (session[0]?.role === 'admin' || session.length || session[0]?._id === data.authorId._id) ? 'block' : 'none'
          }}
        />
      }
    </Box>
  )
}

export default CommentItem