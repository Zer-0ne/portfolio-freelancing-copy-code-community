import { Data, EventsInterface, FormStructure } from '@/utils/Interfaces'
import { colors } from '@/utils/colors'
import { styles } from '@/utils/styles'
import dynamic from 'next/dynamic'
import React, { Key, useState } from 'react'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { Box } from '@mui/material'

const DropDown = dynamic(() => import('@/Components/DropDown'))
const Loading = dynamic(() => import('@/Components/Loading'))

const Forms = ({
    forms,
}: {
    forms: FormStructure;
}) => {
    const { events } = useSelector((state: RootState) => state.events)
    const [isDisabled, setIsDisabled] = useState(false)
    const [data, setData] = useState<Data>()


    // handle Chnage of input fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }


    // handle submit 
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            if (data && !data['certificate']) return alert("There is no active events")
            const { createNew } = await import('@/utils/FetchFromApi');
            await createNew({ functionality: 'update', fields: { ...data as Data }, sheetId: forms?.sheetId }, 'form', setIsDisabled);
            return setData(undefined)
        } catch (error) {
            console.log(error)
        }
    }
    if (!forms) return <Loading />

    const today = new Date(); // This will get the current date

    const todayEvents = (events[0])?.filter((event: EventsInterface) => {
        const eventDate = new Date(event.eventDate);
        console.log(event.eventDate)
        return (
            eventDate.getDate() === today.getDate() &&
            eventDate.getMonth() === today.getMonth() &&
            eventDate.getFullYear() === today.getFullYear()
        );
    })
        // .map(({ _id, title }: { _id: string, title: string }) => ({ _id, title }));
        .map(({ title }: { title: string }) => title);

    return (
        <form onSubmit={handleSubmit}>
            <div className='flex justify-center items-center'>
                <div className='flex gap-[1rem] flex-1 flex-col px-[2rem] justify-center items-center py-[1rem] max-w-[1200px]'>
                    <Container>
                        <h2 className='font-bold text-[2rem] text-[green]'>{forms?.title}</h2>
                        <p className='opacity-[.7]'>{forms?.subtitle}</p>
                    </Container>
                    {
                        forms?.fields?.map((field, index) => (
                            <div key={index} className='w-[100%] flex-1'>
                                <Container>
                                    <p
                                        className='text-[1.2rem] font-semibold mb-2 mx-[3px] capitalize'
                                    >{`${field.name}:`}</p>
                                    <div>
                                        {
                                            ["text", 'email'].includes(field.type) ?
                                                <input onChange={handleChange} name={field.name} value={data?.[field.name] as string || ''} required={field.required} placeholder={field.placeholder} style={styles.customInput()} type={field.type} key={`${field.name}-${index}`} className='w-[100%]' /> : ['select'].includes(field.type) ? <DropDown
                                                    placeholder={field.placeholder}
                                                    values={field.options as string[]}
                                                    onChange={setData}
                                                    name={field.name}
                                                /> :
                                                    <>
                                                        {
                                                            field.options?.map((option, index) => (
                                                                <div key={index} className='gap-[10px] flex items-center pl-2 text-[1rem]' >
                                                                    <input onChange={handleChange} className='text-[2rem] bg-transparent cursor-pointer' required={field.required} id={option} type={field.type} name={field.name} value={option || ''} />
                                                                    <label className='cursor-pointer capitalize' htmlFor={option}>{option}</label>
                                                                </div>
                                                            ))
                                                        }
                                                    </>
                                        }
                                    </div>
                                </Container>
                            </div>
                        ))
                    }
                    <Container>
                        {
                            ['Certificate'].includes(forms?.title) && <>
                                <p className='text-[1.2rem] font-semibold mb-2 mx-[3px] capitalize'>Current Events</p>
                                {(todayEvents?.length) ? <DropDown
                                    key={`${data || ''}`}
                                    onChange={setData}
                                    name={'certificate'}
                                    values={todayEvents && todayEvents}
                                /> :
                                    <input type="text" placeholder='There is no current events' disabled style={styles.customInput(1, {
                                        width: '100%',
                                        color: 'red',
                                        borderColor: 'red'
                                    })} />
                                }
                            </>
                        }
                    </Container>
                    <button style={styles.greenBtn() as React.CSSProperties | undefined} disabled={isDisabled} type='submit' className='self-stretch' >{isDisabled ? "Submitting.." : 'Submit'}</button>
                </div>
            </div>
        </form>
    )
}

export const Container = ({ children, customStyle }: { children: React.ReactNode, customStyle?: Data }) => {
    return (
        <>
            <Box className={`p-[2rem] rounded-lg shadow-md py-[1rem] flex-1 w-[100%]`} sx={{ background: colors.commentConatinerBg, ...customStyle }}>
                {children}
            </Box>
        </>
    )
}

export default Forms