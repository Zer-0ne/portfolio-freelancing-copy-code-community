'use client'

import { BlogsInterface, CommentInterface, Data } from '@/utils/Interfaces'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const Loading = dynamic(() => import('@/Components/Loading'))
const Markdown = dynamic(() => import('@/Components/Markdown'))
const MarkdownHeader = dynamic(() => import('@/Components/MarkdownHeader'))
const CommentContainer = dynamic(() => import('@/Components/CommentContainer'))


const page = () => {
  const pageRef = useRef(false)
  const [data, setData] = useState<BlogsInterface>()
  const [comment, setComment] = useState<CommentInterface[]>()
  const [user, setUser] = useState<Data>()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)


  const fetchedData = async () => {
    try {
      const { Post, userInfo } = await import('@/utils/FetchFromApi')

      // fetching the post means blog
      const res = await Post('blog', id as string)

      if (res?.comments.length) {

        // fetching all the comments related to the post
        const comments = await Post('comment', res.comments.toString())

        setComment(comments)
      }
      const user = await userInfo(res?.authorId)
      setUser(user)
      setData(res)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    (pageRef.current === false) && fetchedData()
    return () => {
      pageRef.current = true;
    }
  }, [])

  if (isLoading) return <Loading />
  return (
    <>
      <MarkdownHeader
        data={data as BlogsInterface}
        user={user as Data}
      />
      <Markdown
        data={data as BlogsInterface}
      />
      <CommentContainer
        data={data as BlogsInterface}
        comments={comment as CommentInterface[]}
        fetchedData={fetchedData}
      />

    </>
  )
}

export default page