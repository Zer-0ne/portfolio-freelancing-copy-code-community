import { Data, DrivePermissionRole, EventsInterface, FormField, FormFile, FormStructure } from '@/utils/Interfaces'
import { colors } from '@/utils/colors'
import { styles } from '@/utils/styles'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { Box } from '@mui/material'
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Image from 'next/image'
import DeleteIcon from '@mui/icons-material/Delete';

const Markdown = dynamic(() => import('@/components/Markdown'))
const CustomModal = dynamic(() => import('@/components/CustomModal'))
const DropDown = dynamic(() => import('@/components/DropDown'))
const Loading = dynamic(() => import('@/components/Loading'))

const Forms = ({
    forms,
}: {
    forms: FormStructure;
}) => {
    const { events } = useSelector((state: RootState) => state.events)
    const [isDisabled, setIsDisabled] = useState(false)
    const [data, setData] = useState<Data>()
    const [remainingUploadFile, setRemainingUploadFile] = useState(0)
    const [openShareModal, setOpenShareModal] = useState<boolean>(false);
    const { session } = useSelector((state: RootState) => state.session)
    const [desiredSequences, setDesiredSequences] = useState<Data[]>([])

    // handle Chnage of input fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (files) {
            handleUpload(files && files[0], name)
        }
        setData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }

    const handleUpload = async (file: File, name: string) => {
        try {
            const { createNew } = await import('@/utils/FetchFromApi');
            const { data } = await createNew(
                {
                    folderId: forms.folderId,
                    file,
                    remainingUploads: remainingUploadFile
                },
                'drive/files/upload',
                setIsDisabled
            );

            if (data && data.id) {
                // Retrieve existing drive data from local storage
                const existingDriveData = JSON.parse(localStorage.getItem('drive') || '{}');
                // Ensure the category (e.g., "resum") exists
                if (!existingDriveData[name]) {
                    existingDriveData[name] = {};
                }

                // Add new entry to the existing drive data
                existingDriveData[name][data.id] = data;

                // Save updated drive data back to local storage
                localStorage.setItem('drive', JSON.stringify(existingDriveData));
            }
            const updatedFiles = Object.keys(JSON.parse(localStorage.getItem('drive') || '{}')).map(key => {
                return `https://drive.google.com/uc?export=view&id=${key}`;
            })
            // Optionally, update the state to reflect the deletion
            setData(prevData => ({
                ...prevData,
                [name]: updatedFiles.length > 0 ? updatedFiles : null // Set to null if no files left
            }));
        } catch (error) {
            console.log((error as Data).message);
        }
    };

    useEffect(() => {
        // Directly set the desired sequences based on field names
        if (forms?.fields) {
            setDesiredSequences(forms?.fields.map(field => ({
                name: field.name,
                required: field.required
            })));
        }
    }, [forms, data]);
    // console.log(desiredSequences)

    const handleDeleteUploadedImage = async (fileId: string, name: string) => {

        try {
            const { deletePost } = await import('@/utils/FetchFromApi');

            // Call the delete API
            await deletePost(fileId, 'drive/files/get/'); // Ensure the endpoint is correct

            // Remove the file entry from local storage
            const existingDriveData = JSON.parse(localStorage.getItem('drive') || '{}');
            // Navigate to the specific category (e.g., "resum") and delete the file ID
            if (existingDriveData[name] && existingDriveData[name][fileId]) {
                delete existingDriveData[name][fileId];
            }
            localStorage.setItem('drive', JSON.stringify(existingDriveData)); // Save updated data

            const updatedFiles = Object.keys(JSON.parse(localStorage.getItem('drive') || '{}')).map(key => {
                return `https://drive.google.com/uc?export=view&id=${key}`;
            });
            // Optionally, update the state to reflect the deletion
            setData(prevData => ({
                ...prevData,
                [name]: updatedFiles.length > 0 ? updatedFiles : null // Set to null if no files left
            }));
        } catch (error) {
            console.log((error as Data).message);
        }
    };


    useEffect(() => {

        // Retrieve 'drive' object from localStorage
        const driveData = JSON.parse(localStorage.getItem('drive') || '{}');

        // console.log(driveData)
        Object.keys(driveData).map((key) => {
            // console.log(key)
            const filesKey = driveData[key];
            Object.keys(filesKey).map(fileKey => {
                setData(prevData => ({
                    ...prevData,
                    [key as string]: `https://drive.google.com/uc?export=view&id=${fileKey}` // Set null if no files found
                }));
            })
            // console.log(filesKey)
        })
    }, [data]);
    // console.log(data)


    // handle submit 
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            if (data && !data['certificate'] && forms['title'] === 'Certificate') return alert("There is no active events")
            const { createNew } = await import('@/utils/FetchFromApi');
            await createNew({ functionality: 'update', fields: { ...data as Data }, sheetId: forms?.sheetId, sequence: desiredSequences && desiredSequences }, 'form', setIsDisabled);
            return setData(undefined)
        } catch (error) {
            console.log(error)
        } finally {
            // Clear the 'drive' object in localStorage
            localStorage.setItem('drive', JSON.stringify({}));
        }
    }
    const fieldTypes = (field: FormField, index: number, radioRef?: React.RefObject<HTMLInputElement>): {
        [key: string]: React.ReactNode;
    } => ({
        email: <>
            <input onChange={handleChange} disabled={isDisabled} name={field.name} value={data?.[field.name] as string || ''} required={field.required} placeholder={field.placeholder} style={{ ...styles.customInput() }} type={field.type} key={`${field.name}-${index}`} className='w-[100%]' />
        </>,
        text: <>
            <input onChange={handleChange} disabled={isDisabled} name={field.name} value={data?.[field.name] as string || ''} required={field.required} placeholder={field.placeholder} style={{ ...styles.customInput() }} type={field.type} key={`${field.name}-${index}`} className='w-[100%]' /></>,
        select: <>
            <DropDown
                placeholder={field.placeholder}
                values={field.options as string[]}
                onChange={setData}
                name={field.name}
            />
        </>,
        radio: <>
            <div className='flex flex-col flex-wrap gap-2'>
                {
                    field?.options?.map((option, index) => (
                        <div key={index} className='gap-[10px] flex items-center pl-2 text-[1rem] flex-row' >
                            <input
                                ref={radioRef}
                                onChange={(e) => {
                                    if (option.toLowerCase() === 'other') {
                                        // Don't update the value yet for 'other' option
                                        setData(prevData => ({
                                            ...prevData,
                                            [field.name]: '' // Clear the field when switching to "Other"
                                        }));
                                    } else {
                                        setData(prevData => ({
                                            ...prevData,
                                            [field.name]: e.target.value
                                        }));
                                    }
                                }}
                                className='text-[2rem] bg-transparent cursor-pointer'
                                required={field.required}
                                id={option}
                                type={field.type}
                                checked={
                                    option.toLowerCase() === 'other'
                                        ? typeof data?.[field.name] === 'string' &&
                                        !field.options?.includes(data[field.name] as string)
                                        : (data?.[field.name] as string) === option
                                }
                                name={field.name}
                                value={option}
                            />
                            {option.toLowerCase() === 'other' ? (
                                <input
                                    type="text"
                                    className='border-none !focus:opacity-10 my-1 !w-[40%] !max-w-[40%] resize-none outline-none bg-transparent flex gap-2 p-[1rem] text-[1rem]'
                                    style={{ ...styles.customInput() }}
                                    placeholder="Please specify"
                                    value={!field.options?.includes(data?.[field.name] as string || '') ? (data?.[field.name] as string || '') : ''}
                                    onClick={() => {
                                        radioRef?.current?.click();
                                    }}
                                    onChange={(e) => {
                                        const { value } = e.target;
                                        setData(prevData => ({
                                            ...prevData,
                                            [field.name]: value // Store the custom value directly
                                        }));
                                    }}
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
        </>,
        file: <>
            <input type='file' disabled={isDisabled} accept={field.fileType as string} ref={radioRef} onChange={handleChange} name={field.name} className='border-none hidden flex-1 resize-none w-[100%] outline-none bg-transparent gap-2 p-[1rem] text-[1rem]' />
            <div
                className='my-1 opacity-60 mb-3 text-[.8rem]'
            >Upload {field.maxFiles} {field.specificFile && `supported file: ${field?.fileType?.split('/')[0]}`}.</div>
            <div
                className='flex flex-2 justify-center p-3 cursor-pointer text-[#969da9] font-normal items-center border-[2px] border-dotted border-white rounded-xl'
                style={{
                    ...styles.customInput(),
                }}
                onClick={() => {
                    // console.log(
                    //     (field?.maxFiles as number) -
                    //     (
                    //         Object.keys(
                    //             (JSON.parse(localStorage.getItem('drive') as string || '{}')[field.name] || {})
                    //         )?.length || 0
                    //     )
                    // );
                    setRemainingUploadFile((field?.maxFiles as number) -
                        (
                            Object.keys(
                                (JSON.parse(localStorage.getItem('drive') as string || '{}')[field.name] || {})
                            )?.length || 0
                        )
                    )

                    radioRef?.current?.click()
                }}
            >Add file for {field.name}</div>
            {
                JSON.parse(localStorage.getItem('drive') as string) && Object.keys(JSON.parse(localStorage.getItem('drive') as string || '{}')[field?.name] || {}).map((key, index) => <div key={key} className='flex flex-1 mt-2 justify-between items-center gap-2'>
                    <div className='flex gap-2 items-center'>
                        <p
                            className='opacity-70'
                        >{`${index + 1}. `}</p>
                        <Image
                            width={50}
                            height={50}
                            src={`https://drive.google.com/uc?export=view&id=${key}`}
                            alt={JSON.parse(localStorage.getItem('drive') as string)[key]?.name as string}
                        />
                        <p>{JSON.parse(localStorage.getItem('drive') as string)[field.name][key]?.name}</p>
                    </div>
                    <button
                        type='button'
                        onClick={() => handleDeleteUploadedImage(key, field.name)}
                    >
                        <DeleteIcon />
                    </button>
                </div>)
            }
        </>
    })

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
            <div className='flex  flex-col justify-center px-[.8rem] items-center'>
                <div style={{
                    maxWidth: '700px'
                }} className='flex gap-[1rem] flex-col  justify-center items-center py-[1rem] max-w-[500px]'>
                    {
                        ['admin', 'moderator'].includes(session[0]?.role) &&
                        <div style={{
                            position: 'sticky',
                            top: 70,
                            zIndex: 1,
                            display: 'flex',
                            flexWrap: 'wrap',
                        }} className='flex !mx-2 sticky top-40 gap-3 w-full justify-center items-stretch flex-1'>
                            <ShareDocModal open={openShareModal} setOpen={setOpenShareModal} forms={forms} />
                            <button type='button' style={{
                                padding: '10px 20px',
                                flexBasis: '100px',
                                fontSize: '1rem',
                                ...styles.glassphorism('10px') as React.CSSProperties
                            }} onClick={async () => {
                                const { downloadSheet } = await import('@/utils/FetchFromApi');
                                await downloadSheet(forms?.sheetId, forms?.title)
                            }} className='mx-2 cursor-pointer flex-1 self-stretch !bg-transparent' >{isDisabled ? "Downloading.." : 'Download Sheet'}</button>
                            <button type='button' style={{
                                padding: '10px 20px',
                                flexBasis: '100px',
                                fontSize: '1rem',
                                ...styles.glassphorism('10px') as React.CSSProperties
                            }} onClick={() => setOpenShareModal(prev => !prev)} className={`mx-2 after:flex after:content-[''] relative after:absolute after:bg-[#44ff001d] after:-z-[1] after:inset-[4px] after:transition-all after:delay-700 after:ease-in-out after:scale-0 hover:after:scale-100 after:rounded-[12px] after:blur-[11px] cursor-pointer self-stretch flex-1 !bg-transparent`} >Share Sheet</button>
                        </div>
                    }
                    <Container>
                        <h2 className='font-bold text-[2rem] text-[green]'>{forms?.title}</h2>
                        <Markdown data={{ content: forms?.subtitle } as Data} border={false} customStyles={{ minWidth: '100% !important', paddingLeft: '0px !important', margin: '0px !important', paddingRight: '0px !important', opacity: 0.7, }} />
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
                                            color: '#e65555',
                                            fontWeight: 'normal',
                                        }} className='!text-[red] font-normal'>*</span>}</p>
                                        <div
                                        >
                                            {
                                                fieldTypes(field, index, radioRef)[field.type as string]
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

export const ShareDocModal = ({
    open,
    setOpen,
    forms
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    forms: FormStructure;
}) => {
    const [data, setData] = useState<Data>()
    const [accessPeople, setAccessPeople] = useState<{
        id: string;
        role: string;
        emailAddress: string;
    }[]>()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    }
    const fetch = async () => {
        const { getData } = await import('@/utils/FetchFromApi')
        setAccessPeople(await getData('/api/drive/permissions/list', {
            fileId: forms.sheetId
        }))
    }
    useEffect(() => {
        fetch()
    }, [])
    // console.log(accessPeople)

    return <>
        <CustomModal
            open={open}
            setOpen={setOpen}
        >
            <div
                className='flex flex-1 flex-wrap flex-col gap-3'
            >
                <h2
                    style={{
                        fontSize: 24
                    }}
                    className='font-bold !text-[24px]'
                >Share "{forms?.title}"</h2>
                <input type="text" name='emailAddress'
                    className='!w-[100%]'
                    onChange={handleChange}
                    placeholder='Enter the email...' style={{ ...styles.customInput() }} />
                {/* people with access the google sheet container */}
                {accessPeople && <div
                    className='flex flex-1 w-[100%] z-10 flex-col px-1 gap-2'
                >
                    <h3
                        className='capitalize text-[1rem] font-semibold mt-3'
                    >people with access</h3>
                    {
                        accessPeople?.map((people, index) => (
                            <div
                                className={`relative ${(people?.role === 'owner') ? 'hidden' : 'flex'} flex-1 justify-between overflow-visible gap-1 opacity-70 items-center`}
                                key={index}
                            >
                                <p
                                    className='truncate flex-1'
                                >{people.emailAddress}</p>
                                <div
                                    onClick={() => setData(data => ({ ...data, ['emailAddress']: people.emailAddress }))}
                                >
                                    <DropDown
                                        values={['reader', 'commenter', 'writer', 'fileOrganizer', 'organizer'] as DrivePermissionRole[]}
                                        name='role'
                                        placeholder={people?.role as string}
                                        onChange={setData}
                                    />
                                </div>
                                <button
                                    onClick={async () => {
                                        const { createNew } = await import('@/utils/FetchFromApi');
                                        await createNew({
                                            permissionId: people.id,
                                            fileId: forms.sheetId
                                        }, 'drive/permissions/delete')
                                        await fetch()
                                    }}
                                    className={`hover:text-[red] transition-all delay-300 ease-in-out after:content-['Remove_Access'] relative after:absolute after:-bottom-[40px] after:-translate-x-[70%] after:scale-0 after:backdrop-blur-sm after:bg-[rgb(0, 0, 0)] after:rounded-[5px] after:text-white after:px-[6px] after:py-[6px] after:text-[10px] after:capitalize after:opacity-0 hover:after:-translate-x-[80%] after:transition-all after:delay-300 after:ease-in-out hover:after:scale-100 hover:after:opacity-100 after:border-[1px] after:border-[rgba(255, 255, 255, 0.125)]`}
                                >
                                    <DoDisturbIcon />
                                </button>
                            </div>
                        ))
                    }
                </div>}
                <DropDown
                    values={['reader', 'commenter', 'writer', 'fileOrganizer', 'organizer'] as DrivePermissionRole[]}
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
                            const { sharePermission } = await import('@/utils/FetchFromApi')
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