'use client'
import { formatBytes } from '@/utils/constant';
import { styles } from '@/utils/styles'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import share from '@/assests/svg/share.svg'
import download from '@/assests/svg/download.svg';
import Delete from '@/assests/svg/delete.svg'
import menu from '@/assests/svg/menu.svg'

interface Files {
    kind: string;
    mimeType: string;
    id: string;
    thumbnailLink: string;
    webViewLink: string;
    name: string;
}
interface DriveStorage {
    storageQuota: {
        limit: string;
        usage: string;
        usageInDrive: string;
        usageInDriveTrash: string;
    }
}
interface Drive {
    nextPageToken: string;
    kind: string;
    files: Files[];
    driveStorage: DriveStorage
}



const Page = () => {
    const [data, setData] = useState<Drive>()
    const [seeMoreFilesViewMore, setSeeMoreFilesViewMore] = useState(8);
    const [isClicked, setIsClicked] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            const { getData } = await import('@/utils/FetchFromApi');
            const data = await getData('/api/drive/files/list', { query: '' })
            setData(data)
        }
        fetch()
    }, [])
    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 justify-center items-start my-2 max-w-[1000px] mx-[1rem] md:mx-[auto] flex-wrap gap-4">
                <p>{`${formatBytes(data?.driveStorage?.storageQuota?.usage as string)} used of ${formatBytes(data?.driveStorage?.storageQuota?.limit as string)}`}</p>
                {/* Recent folders create */}
                <div
                    className='flex gap-2 flex-col w-full'
                >
                    <h3 className='px-1 flex-1 font-semibold text-base opacity-70 my-1 text-start'>Suggested folders</h3>
                    <div
                        className='flex flex-wrap flex-1 w-[100%] justify-center transition-all duration-500 ease-in-out gap-3 items-center'
                    >
                        {
                            (data?.files as Files[])?.filter(file => (file.mimeType).includes('folder')).slice(0, 4)?.map((folder: Files, index) => (
                                <div
                                    style={{
                                        ...styles.glassphorism() as React.CSSProperties,
                                    }}
                                    className={`flex-1 flex-grow-0 basis-[230px] cursor-pointer hover:z-20 justify-between flex py-4 p-3 text-xs md:text-sm rounded-md relative`}
                                    key={index}
                                >
                                    <p className="flex-2 truncate">{folder.name}</p>
                                    <div className="relative group">
                                        <Image
                                            className="overflow-clip opacity-[.7] hover:opacity-100 cursor-pointer transition-all duration-500 ease-in-out"
                                            style={{
                                                overflowClipMargin: "content-box",
                                            }}
                                            onClick={() => setIsClicked((isClicked) => !isClicked)}
                                            alt=""
                                            src={menu}
                                            width={20}
                                            height={20}
                                        />
                                        <div className="group-hover:relative !z-20 top-0 static ">
                                            {/* Content of the dropdown or additional information */}
                                            <div
                                                className="group-hover:z-10 scale-0 opacity-0  transition-all duration-500 ease-in-out group-hover:-top-[20px] group-hover:opacity-100  group-hover:scale-100 group-hover:w-[100px] group-hover:h-[100px]  absolute group-hover:bg-white"
                                                style={{
                                                    ...styles.glassphorism() as React.CSSProperties
                                                }}
                                            >
                                                {/* Dropdown Content */}
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            ))
                        }
                    </div>
                </div>

                {/* Recent files */}
                <h3
                    className='px-1 flex-1 font-semibold text-baee opacity-70 my-1 text-start'
                >
                    Suggested files
                </h3>
                <div className="flex flex-1 justify-center items-center flex-wrap gap-3">
                    {
                        (data?.files as Files[])?.filter(file => !(file.mimeType).includes('folder')).slice(0, seeMoreFilesViewMore)?.map((file: Files, index) => (
                            <Card
                                key={index}
                                onClick={() => { }}
                                file={file}
                            />
                        ))
                    }
                </div>
                <p
                    onClick={() => setSeeMoreFilesViewMore(seeMoreFilesViewMore => seeMoreFilesViewMore + 8)}
                    className='hover:text-[green] transition-all duration-500 ease-in-out cursor-pointer px-1'
                >View more</p>
            </div>
        </div >
    )
}

export default Page


const Card = (props: any) => {
    const { file, ...rest }: {
        file: Files
    } = props;
    const controls = [
        {
            name: 'share',
            icons: ({ imageProps }: { imageProps: object }) => <Image
                className='overflow-clip opacity-[.7] hover:opacity-100 transition-all duration-500 ease-in-out'
                style={{
                    overflowClipMargin: 'content-box'
                }}
                {...imageProps}
                alt=''
                src={share}
                width={25}
                height={25}
            />
        },
        {
            name: 'delete',
            icons: ({ imageProps }: { imageProps: object }) => <Image
                className='overflow-clip opacity-[.7] hover:opacity-100 transition-all duration-500 ease-in-out'
                style={{
                    overflowClipMargin: 'content-box'
                }}
                onClick={async () => {
                    const { deletePost } = await import('@/utils/FetchFromApi');

                    // Call the delete API
                    await deletePost(file.id, 'drive/files/get/');
                }}
                {...imageProps}
                src={Delete}
                alt={Delete}
                width={25}
                height={25}
            />
        },
        {
            name: 'download',
            icons: ({ imageProps }: { imageProps: object }) => <Image
                className='overflow-clip opacity-[.7] hover:opacity-100 transition-all duration-500 ease-in-out'
                style={{
                    overflowClipMargin: 'content-box'
                }}
                {...imageProps}
                src={download}
                alt={download}
                width={25}
                height={25}
            />
        },
    ]
    return <div {...rest} className="group cursor-pointer flex-1 basis-[320px] flex-grow-0">
        <div className="flex relative justify-center items-center group-hover:items-center transition-all flex-col duration-500 ease-in-out ">

            {/* Main */}
            <div style={{
                ...styles.glassphorism() as React.CSSProperties
            }} className="group-hover:scale-[1.01] flex border-[1px] group-hover:!border-[white] flex-col p-[1rem] gap-4 basis-[200px] duration-500 ease-in-out  transition-all !flex-grow-0 min-w-[320px]  w-full">
                <div
                    className='flex justify-between items-center'
                >

                    <p
                        className=" transition-all duration-500 delay-0 ease-in-out w-[100%] text-sm px-1 truncate flex grow-0 group-hover:opacity-100"
                    >
                        {file?.name as string}
                        {/* {file?.mimeType as string} */}
                    </p>
                    <Image
                        className='overflow-clip opacity-[.7] hover:opacity-100 cursor-pointer transition-all duration-500 ease-in-out'
                        style={{
                            overflowClipMargin: 'content-box',
                            flex: 1,

                        }}
                        alt=''
                        src={menu}
                        width={20}
                        height={20}
                    />
                </div>
                <Image
                    className='w-[100%] rounded max-h-[150px] overflow-clip '
                    style={{
                        overflowClipMargin: 'content-box'
                    }}
                    src={file.thumbnailLink}
                    alt={file.name}
                    width={100}
                    height={100}
                />
                {/* <div
                    className='flex flex-1 justify-evenly items-center'
                >
                    {
                        controls.map((control, index) => <div key={index}>
                            {control.icons({
                                imageProps: {
                                    alt: control.name,
                                    className: 'flex  opacity-[0.7] cursor-pointer hover:opacity-100 transition-all duration-500 ease-in-out'
                                }
                            })}
                        </div>)
                    }
                </div> */}
            </div>

        </div>
    </div>
}
// {/* Upper */}
{/* <div
style={{
    ...styles.glassphorism() as React.CSSProperties
}}
className="text-white h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden w-full group-hover:p-2 group-hover:my-1 bg-[red]"
>
Upper Content
</div> */}