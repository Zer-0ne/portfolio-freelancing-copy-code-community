'use client'

import { fetchBlogs } from '@/slices/blogsSlice'
import { AppDispatch, RootState } from '@/store/store'
import { BlogsInterface, CommentInterface, Data } from '@/utils/Interfaces'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Loading = dynamic(() => import('@/Components/Loading'))
const Markdown = dynamic(() => import('@/Components/Markdown'))
const MarkdownHeader = dynamic(() => import('@/Components/MarkdownHeader'))
const CommentContainer = dynamic(() => import('@/Components/CommentContainer'))


const page = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { blogs,loading } = useSelector((state: RootState) => state.blogs)
  const [comment, setComment] = useState<CommentInterface[]>()
  const [user, setUser] = useState<Data>()
  const { id }:any = useParams()

  const result = blogs?.find((item: BlogsInterface) => item._id === id);

  const fetchedData = async () => {
    try {
      const { Post, userInfo } = await import('@/utils/FetchFromApi')

      !blogs.length && dispatch(fetchBlogs())
      // fetching the post means blog
      // const res = await Post('blog', id as string)

      if (result?.comments.length) {

        // fetching all the comments related to the post
        const comments = await Post('comment', result.comments.toString())

        setComment(comments)
      }
      const user = await userInfo(result?.authorId as string)
      setUser(user)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchedData()
  }, [])

  if (loading) return <Loading />
  return (
    <>
      <MarkdownHeader
        data={result as BlogsInterface}
        user={user as Data}
      />
      <Markdown
        data={result as BlogsInterface}
      />
      <CommentContainer
        data={result as BlogsInterface}
        comments={comment as CommentInterface[]}
        fetchedData={fetchedData}
      />

    </>
  )
}

export default page