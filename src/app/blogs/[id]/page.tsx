'use client'

import { BlogsInterface, Data } from '@/utils/Interfaces'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const Loading = dynamic(() => import('@/Components/Loading'))
const Markdown = dynamic(() => import('@/Components/Markdown'))
const MarkdownHeader = dynamic(() => import('@/Components/MarkdownHeader'))


const page = () => {
  const pageRef = useRef(false)
  const [data, setData] = useState<BlogsInterface>()
  const [user, setUser] = useState<Data>()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const fetchedData = async () => {
      try {
        const { Post, userInfo } = await import('@/utils/FetchFromApi')
        const res = await Post('blog', id as string)
        console.log(res)
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
    </>
  )
}

export default page