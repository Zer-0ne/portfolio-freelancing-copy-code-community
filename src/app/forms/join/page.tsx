'use client';
import { Data } from '@/utils/Interfaces';
import { colors } from '@/utils/colors'
import { joinCommunityForm } from '@/utils/forms'
import { styles } from '@/utils/styles'
import dynamic from 'next/dynamic';
import React, { useState } from 'react'

const DropDown = dynamic(() => import('@/components/DropDown'))
const AuthModal = dynamic(() => import('@/components/AuthModal'))


const page = () => {
    const [data, setData] = useState<Data>()
    const [isDisabled, setIsDisabled] = useState(false)

    // handle Chnage of input fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }


    // handle submit 
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const { createNew } = await import('@/utils/FetchFromApi');
            await createNew({ functionality: 'update', fields: { ...data as Data }, sheetId: '1n60nsBS4hbFZdrsaJQ_cY0U3ZTPmCRxWPDJTvxAYMgM' }, 'form', setIsDisabled);
            return setData(undefined)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            <AuthModal />
            <div className='flex justify-center items-center'>
                <div className='flex gap-[1rem] flex-1 flex-col px-[2rem] justify-center items-center py-[1rem] max-w-[1200px]'>
                    <Container>
                        <h2 className='font-bold text-[2rem] text-[green]'>{joinCommunityForm.title}</h2>
                        <p className='opacity-[.7]'>{joinCommunityForm.subtitle}</p>
                    </Container>
                    {
                        joinCommunityForm.fields.map((field, index) => (
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
                    <button style={styles.greenBtn() as React.CSSProperties | undefined} disabled={isDisabled} type='submit' className='self-stretch' >{isDisabled ? "Submitting.." : joinCommunityForm.buttons[0].text}</button>
                </div>
            </div>
        </form>

    )
}

export default page

const Container = ({ children, }: { children: React.ReactNode }) => {
    return (
        <>
            <div className={`p-[2rem] rounded-lg shadow-md py-[1rem] flex-1 w-[100%]`} style={{ background: colors.commentConatinerBg }}>
                {children}
            </div>
        </>
    )
}