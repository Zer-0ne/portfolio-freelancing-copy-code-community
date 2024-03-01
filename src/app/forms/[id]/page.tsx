'use client';
import { AppDispatch, RootState } from '@/store/store';
import { FormStructure } from '@/utils/Interfaces';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const Forms = dynamic(() => import('@/Components/Forms'))
const NotAcceptingForm = dynamic(() => import('@/Components/NotAcceptingForm'))
const Loading = dynamic(() => import('@/Components/Loading'))


const page = () => {
    const [forms, setForms] = useState<FormStructure>()
    const { id } = useParams()
    const dispatch = useDispatch<AppDispatch>()
    const { events } = useSelector((state: RootState) => state.events)



    // fetch form 
    useEffect(() => {
        const fetch = async () => {
            if (!id) return
            const { get, child, ref } = await import('firebase/database')
            const { realTimeDatabase } = await import('@/utils/Firebase')
            const snapshot = await get(child(ref(realTimeDatabase), `forms/${id}`))
            if (!snapshot.exists()) throw new Error("No such form exists")
            const { fetchEvents } = await import('@/slices/eventsSlice')
            !events[0] && dispatch(fetchEvents())
            setForms(snapshot.val() || null)
        }
        fetch()
    }, [])
    if (forms === undefined) return <Loading />

    if (!forms?.['Accepting Response']) return <NotAcceptingForm title={forms?.title as string} />

    return (
        <Forms
            forms={forms as FormStructure}
        />
    )
}

export default page

