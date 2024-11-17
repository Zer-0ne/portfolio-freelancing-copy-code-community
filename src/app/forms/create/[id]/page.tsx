'use client'
import { RootState } from '@/store/store'
import { Data } from '@/utils/Interfaces'
import { colors } from '@/utils/colors'
import { child, get, ref, set } from 'firebase/database'
import { notFound, useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleBtn from '@/components/toggle-btn'
import DropDown from '@/components/DropDown'

const page = () => {
    /**
     * Creating the variable like useState 
     */
    const [array, setArray] = useState<Data[]>([])
    const { session } = useSelector((state: RootState) => state.session)
    const [data, setdata] = useState<Data>()
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    const [currentSelectedFeild, setCurrentSelectedFeild] = useState<number>();
    const { id }: any = useParams()

    /**
     * declaration and defination of addFeild function
     * in this function  we are adding new feilds to our array.
     * @param e - event object which is passed by react onchange event
     */
    const addFeild = () => {
        setArray([...array, {}])
    }

    if (!['admin', 'moderator'].includes(session[0]?.role) && session[0]) return notFound()

    useEffect(() => {
        const write = async () => {
            if (!array.length || !data) return
            setCurrentSelectedFeild(array.length - 1)
            const { createNew } = await import('@/utils/FetchFromApi')
            const { realTimeDatabase } = await import('@/utils/Firebase')
            const nameArray = await array.map((obj: Data) => obj?.name);
            // console.log(data)
            if (data && data['title'] && !data['sheetId']) setdata({ ...data, sheetId: await createNew({ functionality: 'create', fields: [...nameArray], title: data?.title }, 'form', setIsDisabled).then((resp) => resp.data.spreadsheetId) })
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setdata((prev?: Data) => ({ ...prev, [name]: value }))
    }
    // console.log(data)

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
                    <FieldContainer setCurrentSelectedFeild={setCurrentSelectedFeild} currentSelectedFeild={currentSelectedFeild} item={item as Data} setArray={setArray} index={index} key={index}>
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

const FieldContainer = (
    { children, item, setArray, index,
        setCurrentSelectedFeild,
        currentSelectedFeild
    }: {
        children?: React.ReactNode, item: Data, setArray: React.Dispatch<React.SetStateAction<Data[]>>, index: number,
        setCurrentSelectedFeild: React.Dispatch<React.SetStateAction<number | undefined>>,
        currentSelectedFeild?: number
    }) => {
    const [types, setTypes] = useState(item.type || 'text'); // Initialize with item type
    const [data, setData] = useState<Data>();
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

    useEffect(() => {
        data && setArray((prevArray: Data[]) => {
            const newArray: Data[] = [...prevArray];
            const updatedItem: Data = { ...item, type: types, ...data };
            newArray[index] = updatedItem;
            return newArray;
        });
    }, [data])


    /**
     * Delete current feild
     * @param index 
     */
    const deleteField = (index: number) => {
        setArray((array) => array.filter((_, i) => i !== index));
    }

    const handleClick = () => {
        setCurrentSelectedFeild(index); // Set the selected field index
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

    const fileTypes = {
        image: 'image/*',
        document: '.doc,.docx',
        pdf: 'application/pdf',
        spreadsheet: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
        , video: 'video/*',
        audio: 'audio/*',
        zip: 'application/zip'
    }
    // <input type='file' onChange={handleChange} name='file' className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' />

    const typesOfFields: {
        [key in string]: React.JSX.Element
    } = {
        text: <input onChange={handleChange} value={item.placeholder as string || ''} name='placeholder' className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' placeholder='Enter a placeholder here' />,
        email: <input onChange={handleChange} value={item.placeholder as string || ''} name='placeholder' className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' placeholder='Enter a placeholder here' />,
        paragraph: <textarea onChange={handleChange} value={item.placeholder as string || ''} rows={4} name='placeholder' className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' placeholder='Enter a placeholder here'></textarea>,
        radio: <input onChange={handleChange} value={(item.options as string[])?.join(', ') || ''} name='options' className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' placeholder='Enter choices separated by commas' />,
        file: <div className='max-w-[300px] flex flex-col gap-3'>
            <div
                className='flex flex-1 opacity-70 justify-between items-center gap-1'
            >
                <p>Allow only specific file types</p>
                <ToggleBtn
                    isClicked={(item && item['specificFile']) as boolean}
                    className='!w-[40px] !h-[20px]'
                    onClick={() => {
                        setData(data => ({ ...data, ['specificFile']: (data && !data['specificFile']) }))
                    }}
                />
            </div>
            <div className='max-w-[80%] opacity-70'>
                <table className='w-full'>
                    <tbody>
                        {item && item['specificFile'] && (
                            <>
                                {Object.entries(fileTypes).reduce((rows: string[] | any[], [key, value], index) => {
                                    if (index % 2 === 0) {
                                        rows.push([] as any); // New row
                                    }
                                    (rows[rows.length - 1] as any).push(
                                        <td key={key} className='flex max-w-[100px] min-w-[100px] items-center'>
                                            <input
                                                className='checked:border-[green]'
                                                type="radio"
                                                id={key}
                                                name="fileType"
                                                value={value}
                                                checked={(item && item['fileType']) === value}
                                                onChange={(event) => {
                                                    const { name, value } = event.target;
                                                    setData(data => ({ ...data, [name]: value }));
                                                }}
                                            />
                                            <label className='truncate cursor-pointer max-w-[100px] block ml-2' htmlFor={key}>{key}</label>
                                        </td>
                                    );
                                    return rows;
                                }, []).map((row, rowIndex) => (
                                    <tr className='flex max-w-[200px] justify-between items-center' key={rowIndex}>
                                        {row}
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
            <div
                className='flex flex-1 justify-between items-center gap-2'
            >
                <p className='text-[1rem] opacity-70'>Maximum number of files</p>
                <DropDown
                    name='maxFiles'
                    style={{
                        width: '60px!important',
                        zIndex: 20
                    }}
                    onChange={setData}
                    placeholder={item['maxFiles'] as string || '1'}
                    values={['1', '5', '10']}
                />
            </div>
        </div>,
        date: <input type='date' disabled onChange={handleChange} name='date' className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' />,
        time: <input type='time' disabled onChange={handleChange} name='time' className='border-none flex-1 resize-none w-[100%] outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]' />,
    }

    return (
        <div className={`p-[2rem] transition-all delay-300 ease-in-out ${currentSelectedFeild === index ? 'border-2 border-[green] border-opacity-1' : 'border-0 border-[green] border-opacity-0'} cursor-pointer relative rounded-lg shadow-md py-[1rem] flex-1 w-[100%]`} onClick={() => handleClick()} style={{ background: colors.commentConatinerBg }}>
            <div className='flex gap-2 justify-between flex-row flex-wrap-reverse'>
                <input id='heading' name='name' value={item.name as string || ''} placeholder='Enter Heading here' onChange={handleChange} className='border-none flex-1 outline-none bg-transparent text-[1.5rem] flex gap-2 p-[.5rem]' />
                <div>
                    <select onChange={handleTypeChange} value={types as string} name="fieldType" className='bg-transparent rounded-md'>
                        <option className='bg-black rounded-sm' value="text">Short answer</option>
                        <option className='bg-black rounded-sm' value="email">Email</option>
                        <option className='bg-black rounded-sm' value="paragraph">Paragraph</option>
                        <option className='bg-black rounded-sm' value="radio">Multiple Choice</option>
                        <option className='bg-black rounded-sm' value="file">File upload</option>
                        <option className='bg-black rounded-sm' value="date">Date</option>
                        <option className='bg-black rounded-sm' value="time">Time</option>
                    </select>
                    {(currentSelectedFeild === index) && <button
                        className=''
                        onClick={() => deleteField(currentSelectedFeild ?? index)}>
                        <DeleteIcon />
                    </button>}
                </div>

            </div>
            {typesOfFields[types as string]}
            {children}
            <input type="checkbox" id={item?.name as string} name="required" checked={item.required as boolean || false} onChange={handleChange} />
            <label htmlFor={item?.name as string}>Required field?</label><br />
        </div>
    )
}

export default page;