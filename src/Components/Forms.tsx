import { Data, DrivePermissionRole, EventsInterface, FormStructure } from '@/utils/Interfaces'
import { colors } from '@/utils/colors'
import { styles } from '@/utils/styles'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { Box } from '@mui/material'
import { downloadSheet, sharePermission } from '@/utils/FetchFromApi'
import Markdown from './Markdown'
import CustomModal from './CustomModal'

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
    const [openShareModal, setOpenShareModal] = useState<boolean>(false);
    const { session } = useSelector((state: RootState) => state.session)

    // handle Chnage of input fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
    // console.log(forms)

    // handle submit 
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            if (data && !data['certificate'] && forms['title'] === 'Certificate') return alert("There is no active events")
            const { createNew } = await import('@/utils/FetchFromApi');
            await createNew({ functionality: 'update', fields: { ...data as Data }, sheetId: forms?.sheetId }, 'form', setIsDisabled);
            return setData(undefined)
        } catch (error) {
            console.log(error)
        }
    }
    if (!forms) return <Loading />

    const today = new Date(); // This will get the current date

    const todayEvents = (events)?.filter((event: EventsInterface) => {
        const eventDate = new Date(event.eventDate);
        // console.log(event.eventDate)
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
            <div className='flex flex-col justify-center items-center'>
                <div className='flex relative gap-[1rem] flex-1 flex-col px-[2rem] justify-center items-center py-[1rem] max-w-[1200px]'>
                    {
                        ['admin', 'moderator'].includes(session[0]?.role) &&
                        <div style={{
                            position: 'sticky',
                            top: 70,
                            zIndex: 1
                        }} className='flex sticky top-40 gap-3 w-full justify-center items-stretch flex-1'>
                            <ShareDocModal open={openShareModal} setOpen={setOpenShareModal} forms={forms} />
                            <button type='button' style={{
                                padding: '15px 20px',
                                ...styles.glassphorism('10px') as React.CSSProperties
                            }} onClick={() => downloadSheet(forms?.sheetId, forms?.title)} className='mx-2 cursor-pointer flex-1 self-stretch !bg-transparent' >{isDisabled ? "Downloading.." : 'Download Sheets'}</button>
                            <button type='button' style={{
                                padding: '15px 20px',
                                ...styles.glassphorism('10px') as React.CSSProperties
                            }} onClick={() => setOpenShareModal(prev => !prev)} className={`mx-2 after:flex after:content-[''] relative after:absolute after:inset-4 after:bg-white cursor-pointer self-stretch flex-1 !bg-transparent`} >Share Sheet</button>
                        </div>
                    }
                    <Container>
                        <h2 className='font-bold text-[2rem] text-[green]'>{forms?.title}</h2>
                        <Markdown data={{ content: forms?.subtitle } as Data} border={false} customStyles={{ minWidth: '100% !important', paddingLeft: '0px !important', margin: '0px !important', paddingRight: '0px !important', opacity: 0.7 }} />
                    </Container>
                    {
                        forms?.fields?.map((field, index) => {
                            const radioRef = React.useRef<HTMLInputElement>(null);
                            return (
                                <div key={index} className='w-[100%] flex-1 gap-2 flex flex-col'>
                                    <Container>
                                        <p
                                            className='text-[1.2rem] font-semibold mb-2 mx-[3px]  capitalize'
                                        >{`${field.name} `}{(field.required) && <span style={{
                                            color:'#e65555',
                                            fontWeight:'normal',
                                        }} className='!text-[red] font-normal'>*</span>}</p>
                                        <div
                                        >
                                            {
                                                ["text", 'email'].includes(field.type) ?
                                                    <input onChange={handleChange} name={field.name} value={data?.[field.name] as string || ''} required={field.required} placeholder={field.placeholder} style={{ ...styles.customInput() }} type={field.type} key={`${field.name}-${index}`} className='w-[100%]' /> : ['select'].includes(field.type) ? <DropDown
                                                        placeholder={field.placeholder}
                                                        values={field.options as string[]}
                                                        onChange={setData}
                                                        name={field.name}
                                                    /> :
                                                        <div className='flex flex-col flex-wrap gap-2'>
                                                            {
                                                                field.options?.map((option, index) => (
                                                                    <div key={index} className='gap-[10px] flex items-center pl-2 text-[1rem] flex-row' >
                                                                        <input ref={radioRef} onChange={handleChange} className='text-[2rem] bg-transparent cursor-pointer' required={field.required} id={option} type={field.type} name={field.name} value={option || ''} />
                                                                        {option.toLowerCase() === 'other' ? (
                                                                            <input
                                                                                type="text"
                                                                                className='border-none !focus:opacity-10 my-1 !w-[40%] !max-w-[40%] resize-none outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]'
                                                                                style={{ ...styles.customInput() }}
                                                                                placeholder="Please specify"
                                                                                onClick={() => { radioRef?.current?.click(); setData((prevFormData) => ({ ...prevFormData, [field.name]: '' })) }}
                                                                                onChange={(e) => {
                                                                                    const { value } = e.target;
                                                                                    setData((prevFormData) => ({ ...prevFormData, [field.name]: value }));
                                                                                }} // Handle change for the "Other" input
                                                                            />
                                                                        ) : (
                                                                            <>
                                                                                <label className='cursor-pointer capitalize hover:text-[green]' htmlFor={option}>
                                                                                    {option}
                                                                                </label>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                            }
                                        </div>
                                    </Container>
                                </div>
                            )
                        })
                    }
                    {
                        ['Certificate'].includes(forms?.title) && <Container>
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
                        </Container>
                    }
                    <button style={styles.greenBtn() as React.CSSProperties | undefined} disabled={isDisabled} type='submit' className='self-stretch' >{isDisabled ? "Submitting.." : 'Submit'}</button>
                </div>
            </div>
        </form>
    )
}

export const Container = ({ children, customStyle }: { children: React.ReactNode, customStyle?: Data }) => {
    return (
        <>
            <Box className={`p-[2rem] gap-1 flex flex-col rounded-lg shadow-md py-[1rem] flex-1 w-[100%]`} sx={{ background: colors.commentConatinerBg, ...customStyle }}>
                {children}
            </Box>
        </>
    )
}

const ShareDocModal = ({
    open,
    setOpen,
    forms
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    forms: FormStructure;
}) => {
    const [data, setData] = useState<Data>()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    }
    return <>
        <CustomModal
            open={open}
            setOpen={setOpen}
        >
            <div
                className='flex flex-1 flex-wrap text-[30px] flex-col gap-3'
            >
                <h2
                    style={{
                        fontSize: 24
                    }}
                    className='font-bold !text-[50px]'
                >Share "{forms?.title}"</h2>
                <input type="text" name='emailAddress'
                    onChange={handleChange}
                    placeholder='Enter the email...' style={{ ...styles.customInput() }} />
                <DropDown
                    values={['reader', 'commenter', 'writer', 'fileOrganizer', 'organizer', 'owner'] as DrivePermissionRole[]}
                    name='role'
                    placeholder='Enter the permission'
                    onChange={setData}
                    valuesStyles={{
                        maxHeight: '50px'
                    }}
                />
                <div
                    className='flex self-end my-2 gap-2'
                >
                    <button
                        className='self-end'
                        onClick={() => setOpen(prev => !prev)}
                        style={{
                            padding: 5
                        }}
                    >Cancel</button>
                    <button
                        style={{
                            padding: '5px 10px',

                        }}
                        onClick={async () => {
                            await sharePermission({
                                fileId: forms?.sheetId,
                                emailAddress: data?.emailAddress,
                                role: data?.role
                            }); setOpen(prev => !prev)
                        }}
                        className='mx-2 !p-[10px] rounded bg-[green]'
                    >Send</button>
                </div>
            </div>
        </CustomModal>
    </>
}

export default Forms