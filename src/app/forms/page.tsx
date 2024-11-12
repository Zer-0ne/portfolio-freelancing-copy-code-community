'use client'
import { RootState } from '@/store/store'
import { FormStructure } from '@/utils/Interfaces'
import { update } from '@/utils/ToastConfig'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import DrawIcon from '@mui/icons-material/Draw';
import DeleteIcon from '@mui/icons-material/Delete';

const page = () => {
    const { session } = useSelector((state: RootState) => state.session)
    const [data, setData] = useState<object[]>([])
    useEffect(() => {
        const fetch = async () => {
            const { get, child, ref } = await import('firebase/database')
            const { realTimeDatabase } = await import('@/utils/Firebase')
            const snapshot = await get(child(ref(realTimeDatabase), `forms/`))
            snapshot.exists()
            setData(Object.values(snapshot.val()) || [])
        }
        fetch()
    }, [])
    return (
        <div
            className='flex flex-1 flex-wrap gap-2 container flex-col mx-[auto] px-3 my-3'
        >
            {/* <h2 className='text-2xl font-bold text-[green]'>Create a forms</h2> */}
            <div className='flex flex-wrap gap-2 justify-center'>

                <Link href={`/forms/create/${Date.now()}`} className={`${['admin', 'moderator'].includes(session[0]?.role) ? 'flex' : 'hidden'} flex-1 rounded-lg border-dotted p-[1rem] justify-center items-center m-[5px] border-[2px] max-h-fit text-[green] cursor-pointer border-[green] opacity-80 basis-[250px] grow-0 shrink-0  hover:opacity-100 transition-all ease-in-out delay-150`}>Create a new forms</Link>
                {
                    data?.map((item, index) => (
                        <FormCard key={index} item={item as FormStructure} session={session} />
                    ))
                }
            </div>
        </div>
    )
}

export default page

const FormCard = ({ item, session }: { item: FormStructure, session: any }) => {
    const [isAccepting, setIsAccepting] = useState(item['Accepting Response'])
    const handleClick = () => {
        setIsAccepting(prev => !prev)
    }
    useEffect(() => {
        const write = async () => {
            if (!['admin', 'moderator'].includes(session[0]?.role)) return 'Your are not authorized'
            const { set, ref, get, child } = await import('firebase/database');
            const { realTimeDatabase } = await import("@/utils/Firebase");
            const snapshot = await get(child(ref(realTimeDatabase), `forms/${item._id}`));
            snapshot.exists()
            await set(ref(realTimeDatabase, `forms/${item._id}`), {
                ...snapshot.val(),
                'Accepting Response': isAccepting,
            });
        }
        write()
    }, [isAccepting])

    /**
     * 1. check the current user has authority?
     * 2. delete the google sheet
     * 3. check the response from api
     * 4. import some functions
     * 5. remove the form from realtime database
     * 6. response to the user
     * @returns response
     */
    const deleteForm = async () => {
        const Toast = toast.loading('Please wait')
        try {
            if (!['admin', 'moderator'].includes(session[0]?.role)) return 'Your are not authorized'
            const response = await fetch(`/api/sheet/${item?.sheetId}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                const errorMessage = await response.text(); // Get the error message from the response
                throw new Error(`Failed to delete sheet: ${errorMessage}`);
            }
            const { realTimeDatabase } = await import("@/utils/Firebase");
            const { ref, remove } = await import('firebase/database');
            const formsRef = ref(realTimeDatabase, `forms/${item._id}`);
            await remove(formsRef);
            return toast.update(Toast, update('Deleted successfully!', 'success'))
        } catch (error) {
            console.log(error)
            return toast.update(Toast, update('Something went wrong!', 'error'))
        }
    }


    return (
        <div className='flex max-h-fit relative flex-1 gap-2 flex-col rounded-lg border-dotted p-[1rem] justify-start opacity-75 hover:opacity-100 transition-all ease-in-out delay-150 items-center m-[5px] border-[2px] basis-[250px] grow-0 shrink-0 border-[white]'>

            <div
                className='absolute top-8 left-4 flex flex-1 justify-between items-center gap-2'
            >
                <button
                    onClick={deleteForm}
                >
                    <DeleteIcon
                        className=' opacity-75 cursor-pointer '
                    />
                </button>
                <Link href={`/forms/create/${item._id}`}>
                    <DrawIcon
                        className='opacity-75 cursor-pointer '
                    />
                </Link>
            </div>
            {/* toggle btn */}
            <div className={`flex gap-1 self-end ${['admin', 'moderator'].includes(session[0]?.role) ? 'block' : 'hidden'}`}>
                <div onClick={handleClick} className='cursor-pointer flex gap-3 items-center'>
                    <div className='p-4 rounded-[20px] relative bg-[#3d38389d] inline-block w-[60px] my-2'>
                        <div className={`cursor-pointer w-[40%] btnAnimations absolute ${isAccepting ? 'right-[5px]' : 'left-[5px]'} top-[5px] bottom-[5px] ${isAccepting ? 'bg-[green]' : 'bg-[grey]'} rounded-full transition-all duration-1000 ease-in-out `} style={{
                            transition: 'all .3s ease-in-out',
                        }}></div>
                    </div>
                </div>
            </div>
            <Link className='cursor-pointer flex-1 w-[100%] text-center' href={`forms/${item._id}`}>
                <div>
                    {item?.title as string}
                </div>
            </Link>
        </div>
    )
}