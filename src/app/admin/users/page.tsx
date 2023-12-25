'use client'
import CustomModal from '@/Components/CustomModal'
import Loading from '@/Components/Loading'
import UserCard from '@/Components/UserCard'
import { allUser, userInfo } from '@/utils/FetchFromApi'
import { Data, Session } from '@/utils/Interfaces'
import { currentSession } from '@/utils/Session'
import { Backdrop, Box, Container, Fade, Modal } from '@mui/material'
import { notFound } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
  const [isAdmin, setIsAdmin] = React.useState<boolean>(true)
  const [isloading, setIsloading] = React.useState<boolean>(true)
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<Data[]>()
  const [isUpdate, setIsUpdate] = React.useState<Data>()

  useEffect(() => {
    const user = async () => {
      const session = await currentSession() as Session
      const currUser = await userInfo(session?.user.username);
      (session && currUser.isAdmin === true) ? setIsAdmin(true) : setIsAdmin(false)
      const alluser = await allUser('user')
      setData(alluser)
      setIsloading(false)
      return (currUser.isAdmin) ? true : false;
    }
    user()
  }, [])
  if (isloading) return <Loading />
  if (!isAdmin) return notFound()

  const handleDelete = async () => {
    try {
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