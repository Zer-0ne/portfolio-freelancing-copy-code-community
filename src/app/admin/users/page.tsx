'use client'

import { Data, Session } from '@/utils/Interfaces'
import { Container, } from '@mui/material'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

const Loading = dynamic(() => import('@/Components/Loading'))
const CustomModal = dynamic(() => import('@/Components/CustomModal'))
const UserCard = dynamic(() => import('@/Components/UserCard'))
// const { fetchSession } = dynamic(() => import('@/slices/sessionSlice'))

const page = () => {
  const pageRef = useRef(false)
  const [isloading, setIsloading] = React.useState<boolean>(true)
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<Data[]>()
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [isUpdate, setIsUpdate] = React.useState<Data>()

  const user = async () => {
    const { allUser, userInfo } = await import('@/utils/FetchFromApi')
    const { currentSession } = await import('@/utils/Session');

    const session = await currentSession() as Session
    if (!session) {
      setIsloading(false)
      return notFound()
    }
    const currUser = await userInfo(session?.user.username);
    (session && ['user', 'moderator'].includes(currUser.role)) ? setIsAdmin(false) : setIsAdmin(true)

    if (session && ['admin'].includes(currUser.role)) {
      const alluser = await allUser('user')
      setData(alluser)
    }
    setIsloading(false)
  }

  useEffect(() => {
    (pageRef.current === false) && user()
    return () => {
      pageRef.current = true
    }
  }, [])
  if (isloading) return <Loading />
  if (isAdmin === false) return notFound()

  const handleDelete = async () => {
    try {
      const { userInfo, allPost } = await import('@/utils/FetchFromApi')
      await userInfo(isUpdate?.username as string, 'DELETE')
      const alluser = await allPost('user')
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
            fetchedUser={user}
            key={index}
          />
        ))
      }
    </Container>
  )
}

export default page