'use client'
import CustomModal from '@/Components/CustomModal'
import Loading from '@/Components/Loading'
import UserCard from '@/Components/UserCard'
import { fetchSession } from '@/slices/sessionSlice'
import { AppDispatch, RootState } from '@/store/store'
import { allUser, userInfo } from '@/utils/FetchFromApi'
import { Data, Session } from '@/utils/Interfaces'
import { currentSession } from '@/utils/Session'
import { Backdrop, Box, Container, Fade, Modal } from '@mui/material'
import { notFound } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const page = () => {
  const pageRef = useRef(false)
  const [isloading, setIsloading] = React.useState<boolean>(true)
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<Data[]>()
  const dispatch = useDispatch<AppDispatch>()
  const { session } = useSelector((state: RootState) => state.session)
  const [isUpdate, setIsUpdate] = React.useState<Data>()
  
  const user = async () => {
    // fetch session from the redux store 
    await dispatch(fetchSession());
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