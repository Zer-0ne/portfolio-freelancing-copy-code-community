'use client'
import Loading from '@/Components/Loading'
import UserCard from '@/Components/UserCard'
import { userInfo } from '@/utils/FetchFromApi'
import { Session } from '@/utils/Interfaces'
import { currentSession } from '@/utils/Session'
import { Container } from '@mui/material'
import { notFound } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
  const [isAdmin, setIsAdmin] = React.useState<boolean>(true)
  const [isloading, setIsloading] = React.useState<boolean>(true)
  useEffect(() => {
    const user = async () => {
      const session = await currentSession() as Session
      const currUser = await userInfo(session?.user.username);
      (session && currUser.isAdmin === true) ? setIsAdmin(true) : setIsAdmin(false)
      setIsloading(false)
      return (currUser.isAdmin) ? true : false;
    }
    user()
  }, [])
  if (isloading) return <Loading />
  if (!isAdmin) return notFound()
  return (
    <Container
      sx={{
        display: 'flex',
        gap: 1,
        flexDirection: 'column'
      }}
    >
      {
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
          <UserCard
            key={index}
          />
        ))
      }
    </Container>
  )
}

export default page