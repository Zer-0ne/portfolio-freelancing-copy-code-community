'use client'
import { RootState } from '@/store/store'
import { realTimeDatabase } from '@/utils/Firebase'
import { Data } from '@/utils/Interfaces'
import { controls } from '@/utils/constant'
import { child, get, onValue, ref, set } from 'firebase/database'
import { notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const page = () => {
    const [data, setData] = useState<Data>()
    const { session } = useSelector((state: RootState) => state.session)
    const fetch = async () => {
        try {
            const snapshot = await get(child(ref(realTimeDatabase), `controls`))
            snapshot.exists() && setData(snapshot.val())
            // const res = get(ref(realTimeDatabase, `controls`))
        } catch (error) {
            console.log(error)
        }
    }
    if (!['admin', 'moderator'].includes(session[0]?.role)) return notFound()
    useEffect(() => {
        fetch()
    }, [])

    return (
        <div
            className='container self-center mx-[auto] p-5 flex flex-1 flex-col gap-3'
        >
            <h2 className='text-3xl'>Controls</h2>
            {
                controls.map((item, index) => (
                    <Button key={index} item={item} setData={setData} data={data as Data} />
                ))
            }
        </div>
    )
}

export default page

const Button = ({ item, setData, data }: { item: string, setData: React.Dispatch<React.SetStateAction<Data | undefined>>, data: Data }) => {
    const handleClick = async () => {
        setData((prevFormData) => (prevFormData && { ...prevFormData, [item]: !prevFormData[item] }));
    }
    useEffect(() => {
        const fetch = async () => {
            if (data) {
                await set(ref(realTimeDatabase, 'controls/'), {
                    ...data,
                });
            }
        }
        data && fetch()
    }, [data])

    return (
        <>
            <div onClick={handleClick} className='cursor-pointer flex gap-3 items-center'>
                <div className='p-4 rounded-[20px] relative bg-[#3d38389d] inline-block w-[60px] my-2'>
                    <input name={item} className={`cursor-pointer w-[40%] btnAnimations absolute ${data && data[item] ? 'right-[5px]' : 'left-[5px]'} top-[5px] bottom-[5px] ${data && data[item] ? 'bg-[green]' : 'bg-[grey]'} rounded-full transition-all duration-1000 ease-in-out `} style={{
                        transition: 'all .3s ease-in-out',
                    }}></input>
                </div>
                <div className='text-2xl font-bold capitalize '>{item} Forms</div>
            </div>
        </>
    )
}