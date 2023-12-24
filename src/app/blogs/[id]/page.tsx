'use client'
import Loading from '@/Components/Loading'
import Markdown from '@/Components/Markdown'
import { Post } from '@/utils/FetchFromApi'
import { BlogsInterface } from '@/utils/Interfaces'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [data, setData] = useState<BlogsInterface>()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)

  
  useEffect(() => {
    const fetchedData = async () => {
      try {
        const res = await Post('blog', id as string)
        setData(res)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchedData()
  }, [])
  
  if (isLoading) return <Loading />
  return (
    <>
      <Markdown
        data={data as BlogsInterface}
      />
    </>
  )
}

export default page