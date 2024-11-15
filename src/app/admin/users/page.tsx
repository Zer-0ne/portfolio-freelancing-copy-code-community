'use client'

import useSession from '@/hooks/useSession'
import { Data } from '@/utils/Interfaces'
import { Container, Typography, } from '@mui/material'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { styles } from '@/utils/styles'
import React, { useEffect } from 'react'

const Loading = dynamic(() => import('@/components/Loading'))
const CustomModal = dynamic(() => import('@/components/CustomModal'))
const UserCard = dynamic(() => import('@/components/UserCard'))
// const { fetchSession } = dynamic(() => import('@/slices/sessionSlice'))

const page = () => {
	const [open, setOpen] = React.useState(false);
	const [data, setData] = React.useState<Data[]>()
	const [isUpdate, setIsUpdate] = React.useState<Data>()
	const { isLoading, isAdmin, error } = useSession()

	const user = async () => {
		const { allUser } = await import('@/utils/FetchFromApi')
		if (isAdmin && !error) {
			const alluser = await allUser('user')
			setData(alluser)
		}
	}

	useEffect(() => {
		user()
	}, [isAdmin])

	if (isLoading) return <Loading />
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

	if (error) {
		return <div
			className='flex flex-1 w-full py-auto absolute top-[50%] right-[50%] translate-x-[50%] -translate-y-[50%] justify-center my-auto items-center'
		>
			<Typography
				sx={{
					...styles.glassphorism()
				}}
				className='flex w-[70%] md:w-[40%] min-h-[100px] p-10 justify-center items-center font-bold text-center  text-[#ffffff] capitalize  text-3xl rounded border-[#ff000034] border-[1px]'
			>
				something went wrong!
			</Typography>
		</div>
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
				open={open}
				setOpen={setOpen}
			>
				<Typography
					variant='h3'
					sx={{
						fontWeight: '600'
						, fontSize: 25
					}}
				>{
						`Are you sure to delete "${isUpdate?.name}"?`
					}</Typography>
				<Typography
					variant='caption'
					sx={{
						fontWeight: '300'
						, fontSize: 18
					}}
				>
					{`Are you sure you want to delete the user ${isUpdate?.username} name ${isUpdate?.name}? This action cannot be undone.`}
				</Typography>
				<button
					style={{
						background: 'red',
						padding: 6,
						borderRadius: "10px",
					}}
					onClick={handleDelete}
				>Delete</button>
			</CustomModal>
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