'use client'


import { RootState } from '@/store/store'
import { Data } from '@/utils/Interfaces'
import { Container, } from '@mui/material'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

const Loading = dynamic(() => import('@/Components/Loading'))
const CustomModal = dynamic(() => import('@/Components/CustomModal'))
const UserCard = dynamic(() => import('@/Components/UserCard'))
// const { fetchSession } = dynamic(() => import('@/slices/sessionSlice'))

const page = () => {
  const pageRef = useRef(false)
  const [isloading, setIsloading] = React.useState<boolean>(true)
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<Data[]>()
  const { session } = useSelector((state: RootState) => state.session)
  const [isUpdate, setIsUpdate] = React.useState<Data>()

  const user = async () => {
    const { allUser } = await import('@/utils/FetchFromApi')

    const alluser = await allUser('user')
    setData(alluser)
    setIsloading(false)
    return (session[0]?.isAdmin) ? true : false;
  }

  useEffect(() => {
    (pageRef.current === false) && user()
    return () => {
      pageRef.current = true
    }
  }, [])
  if (isloading) return <Loading />
  if (session[0]?.isAdmin === false) return notFound()
  if (!session.length) return notFound()

  const handleDelete = async () => {
    try {
      const { userInfo, allUser } = await import('@/utils/FetchFromApi')
      await userInfo(isUpdate?.username as string, 'DELETE')
      const alluser = await allUser('user')
      setData(alluser)
      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container
      sx={{
        display: 'flex',
        gap: 1,
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      <CustomModal
        item={isUpdate as Data}
        open={open}
        setOpen={setOpen}
        onClick={handleDelete}
        title={`Are you sure to delete "${isUpdate?.name}"?`}
        content={`Are you sure you want to delete the user ${isUpdate?.username}? This action cannot be undone.`}
      />
      {
        data?.map((item, index) => (
          <UserCard
            item={item}
            setIsUpdate={setIsUpdate}
            setOpen={setOpen}
            setdata={setData}
            key={index}
          />
        ))
      }
    </Container>
  )
}

export default page