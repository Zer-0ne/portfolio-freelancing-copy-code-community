'use client'
import { AppDispatch, RootState } from '@/store/store'
import { Data } from '@/utils/Interfaces'
import { colors } from '@/utils/colors'
import { child, get, ref, set } from 'firebase/database'
import { notFound, useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const page = () => {
    /**
     * Creating the variable like useState 
     */
    const [array, setArray] = useState<Data[]>([])
    const { session } = useSelector((state: RootState) => state.session)
    const [data, setdata] = useState<Data>()
    const dispatch = useDispatch<AppDispatch>()
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    const { id }: any = useParams()

    /**
     * declaration and defination of addFeild function
     * in this function  we are adding new feilds to our array.
     * @param e - event object which is passed by react onchange event
     */
    const addFeild = () => {
        setArray([...array, { key: '', value: '' }])
    }

    if (!['admin', 'moderator'].includes(session[0]?.role) && session[0]) return notFound()

    useEffect(() => {
        const write = async () => {
            if (!array.length || !data) return
            const { createNew } = await import('@/utils/FetchFromApi')
            const { realTimeDatabase } = await import('@/utils/Firebase')
            const nameArray = await array.map((obj: Data) => obj?.name);
            if (data && data['sheetId'] === '') setdata({ ...data, sheetId: await createNew({ functionality: 'create', fields: [...nameArray], title: data?.title }, 'form', setIsDisabled).then((resp) => resp.data.spreadsheetId) })
            data && await set(ref(realTimeDatabase, `forms/${id}`), {
                _id: id,
                'Accepting Response': true,
                ...data,
                fields: array,
            });
        }
        write()
    }, [array, data, session])

    useEffect(() => {
        const fetch = async () => {
            const { realTimeDatabase } = await import('@/utils/Firebase')
            const snapshot = await get(child(ref(realTimeDatabase), `forms/${id}`))
            // const { createNew } = await import('@/utils/FetchFromApi')
            // const nameArray = await array.map((obj) => obj?.name);
            if (snapshot.exists()) {
                console.log(snapshot.val())
                await setdata(snapshot.val())
                // console.log(data && await createNew({ functionality: 'create', fields: [...nameArray], title: data?.title }, 'form', setIsDisabled).then((resp) => resp).catch(() => ''))
                setArray(snapshot.val()?.fields || [])
            }
        }
        fetch()
    }, [])
    console.log()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setdata((prev?: Data) => ({ ...prev, [name]: value }))
    }

    /**
     * Here the jsx
     */
    return (
        <div
            className='container !max-w-[1000px] mx-[auto] my-3 px-4 flex flex-wrap flex-col gap-2'
        >
            <Container>
                <input name='title' onChange={handleChange} value={data?.title as string} placeholder='Enter Heading here' className='border-none outline-none bg-transparent text-[2rem] flex gap-2 p-[1rem]'></input>
                <textarea rows={4} value={data?.subtitle as string} name='subtitle' onChange={handleChange} className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' placeholder='Enter a decription here'></textarea>
            </Container>
            {
                array?.map((item: Data, index: number) => (<>
                    <FieldContainer item={item as Data} setArray={setArray} index={index} key={index}>
                        <></>
                    </FieldContainer>
                </>))
            }
            <button onClick={addFeild} disabled={isDisabled} className='flex flex-1 rounded-lg border-dotted p-[1rem] justify-center items-center m-[5px] border-[2px] text-[green] cursor-pointer border-[green] opacity-80 basis-[50px] grow-0 shrink-0  hover:opacity-100 transition-all ease-in-out delay-150'>Add a new field</button>
        </div>
    )
}

/**
 * 
 * @param param0 Here the  props of Container Component that is children which allows the  passing of component inside container
 * @returns jsx
 */
const Container = ({ children, }: { children: React.ReactNode }) => {
    return (
        <>
            {/* decription */}
            <div className={`p-[2rem] rounded-lg shadow-md py-[1rem] flex-1 w-[100%]`} style={{ background: colors.commentConatinerBg }}>
                {children}
            </div>
        </>
    )
}

/**
 * Here the another component
 */

const FieldContainer = ({ children, item, setArray, index }: { children?: React.ReactNode, item: Data, setArray: React.Dispatch<React.SetStateAction<Data[]>>, index: number }) => {
    const [types, setTypes] = useState(item.type || 'text'); // Initialize with item type
    // console.log(item)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setArray((prevArray: Data[]) => {
            const newArray: Data[] = [...prevArray];
            const updatedItem: Data = { ...item, [name]: (name === 'required') ? (e.target as any).checked : value, type: types };
            if (name === 'options') {
                // Split choices by comma and trim spaces
                const choicesArray = value.split(',').map((choice: any) => choice.trim());
                updatedItem[name] = choicesArray;
            }
            newArray[index] = updatedItem;
            return newArray;
        });
    }

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setTypes(newType); // Update local state
        setArray((prevArray: Data[]) => {
            const newArray = [...prevArray];
            const updatedItem = { ...item, type: newType }; // Update the type in the item
            newArray[index] = updatedItem; // Update the array with the new item
            return newArray;
        });
    }

    const typesOfFields: {
        [key in string]: React.JSX.Element
    } = {
        text: <input onChange={handleChange} value={item.placeholder as string || ''} name='placeholder' className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' placeholder='Enter a placeholder here' />,
        email: <input onChange={handleChange} value={item.placeholder as string || ''} name='placeholder' className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' placeholder='Enter a placeholder here' />,
        paragraph: <textarea onChange={handleChange} value={item.placeholder as string || ''} rows={4} name='placeholder' className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' placeholder='Enter a placeholder here'></textarea>,
        radio: <input onChange={handleChange} value={(item.options as string[])?.join(', ') || ''} name='options' className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' placeholder='Enter choices separated by commas' />,
        file: <input type='file' onChange={handleChange} name='file' className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' />,
        date: <input type='date' onChange={handleChange} name='date' className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' />,
        time: <input type='time' onChange={handleChange} name='time' className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' />,
    }

    return (
        <div className={`p-[2rem] rounded-lg shadow-md py-[1rem] flex-1 w-[100%]`} style={{ background: colors.commentConatinerBg }}>
            <div className='flex gap-2 justify-between'>
                <input id='heading' name='name' value={item.name as string || ''} placeholder='Enter Heading here' onChange={handleChange} className='border-none outline-none bg-transparent text-[1.5rem] flex gap-2 p-[.5rem]' />
                <select onChange={handleTypeChange} value={types as string} name="fieldType" className='bg-transparent rounded-md'>
                    <option className='bg-black rounded-sm' value="text">Short answer</option>
                    <option className='bg-black rounded-sm' value="email">Email</option>
                    <option className='bg-black rounded-sm' value="paragraph">Paragraph</option>
                    <option className='bg-black rounded-sm' value="radio">Multiple Choice</option>
                    <option className='bg-black rounded-sm' value="file">File upload</option>
                    <option className='bg-black rounded-sm' value="date">Date</option>
                    <option className='bg-black rounded-sm' value="time">Time</option>
                </select>
            </div>
            {typesOfFields[types as string]}
            {children}
            <input type="checkbox" name="required" checked={item.required as boolean || false} onChange={handleChange} />
            <label htmlFor="required">Required field?</label><br />
        </div>
    )
}

export default page;