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


  useEffect(() => {
    const fetchedData = async () => {
      try {
        const { Post, userInfo, fetchComment } = await import('@/utils/FetchFromApi')
        const res = await Post('blog', id as string)
        if (res?.comments) {
          const comments = await fetchComment(res.comments.toString())
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
      {/* <CommentContainer
        data={data as BlogsInterface}
        comments={comment as CommentInterface[]}
      /> */}

    </>
  )
}

export default page