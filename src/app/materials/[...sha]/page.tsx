'use client'
import { Box } from '@mui/material'
import { styles } from '@/utils/styles';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { NavigateNext } from '@mui/icons-material';
import dynamic from 'next/dynamic';

const Loading = dynamic(() => import('@/Components/Loading'))
const Markdown = dynamic(() => import('@/Components/Markdown'))


const page = () => {
    const { sha } = useParams()
    const [url, setUrl] = useState<string>('')
    const [data, setData] = useState<string>();
    const [isloading, setIsLoading] = useState<boolean>(true)
    const [navData, setNavData] = useState<{
        path: string;
        url: string;
        sha: string;
    }[]>()
    const [isOpen, setIsOpen] = useState(false)
    const [searchInput, setSearchInput] = useState<string>('')

    // for navbar
    useEffect(() => {
        const fetch = async () => {
            const { getSpecificMaterialGithub } = await import('@/utils/FetchFromApi')
            const data = await getSpecificMaterialGithub(sha[1])
            // data.reverse()
            setUrl(data[0].url)
            setNavData(data)
        }
        fetch()
    }, [])

    // for content
    useEffect(() => {
        const fetch = async () => {
            if (url === '') return
            setIsLoading(true)
            const { getSpecificContentGithub } = await import('@/utils/FetchFromApi')
            const data = await getSpecificContentGithub(url)
            const decode = atob(data?.content)
            setData(decode)
            setIsLoading(false)
        }
        fetch()
    }, [url])
    return (
        <div>
            <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} setUrl={setUrl} navData={navData as {
                path: string;
                url: string;
                sha: string;
            }[]} sha={sha[0]} setSearchInput={setSearchInput} searchInput={searchInput} url={url} />
            <ContentPage data={data as string} isloading={isloading} />
        </div>
    )
}

const Sidebar = ({ setIsOpen, isOpen, navData, setUrl, sha, setSearchInput, searchInput, url }: {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; isOpen: boolean; navData: {
        path: string;
        url: string;
        sha: string;
    }[];
    sha: string
    url: string
    searchInput: string
    setUrl: React.Dispatch<React.SetStateAction<string>>
    setSearchInput: React.Dispatch<React.SetStateAction<string>>
}) => {
    const filteredEvents = navData?.filter(
        (item) =>
            item?.path.toLowerCase().includes(searchInput.toLowerCase())
    );
    return (
        <>

            <Box
                sx={{
                    position: 'fixed', display: 'flex',
                    top: 'calc(50px + 24px + 22px)', bottom: 0, width: { xs: 200, xl: '10vw' }, left: { xs: isOpen ? 5 : -200, xl: 10 }, zIndex: 10,
                    ...styles.glassphorism(), gap: 2,
                    p: 2, mb: 2, pt: 3, pb: 3, transition: 'all .5s ease-in-out', flexDirection: 'column'
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        right: -50, top: 10, p: '12px 8px', ...styles.glassphorism(), transition: 'all .5s ease-in-out',
                        cursor: 'pointer', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: { xs: 'block', md: 'block', xl: 'none' }
                    }}
                    onClick={() => { setIsOpen(prev => !prev) }}
                >
                    <NavigateNext />
                </Box>
                <Box>
                    <input placeholder='Search...' onChange={(e) => setSearchInput(e.target.value)} style={{
                        ...styles.customInput(1, {
                            width: '100%'
                        })
                    }} />
                </Box>
                <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>

                    {
                        !navData ? <>No post yet!</> :
                            filteredEvents?.map((item, index) => (
                                <Box onClick={() => { setUrl(item.url) }} key={index} sx={{
                                    cursor: 'pointer',
                                    opacity: (item.url).includes(url) ? 1 : .5,
                                    transition: 'all .5s ease-in-out',
                                    ':hover': {
                                        opacity: 1,
                                        transform: 'scale(1.018)'
                                    }
                                }}>
                                    {decodeURIComponent(sha)} {(item.path.split('.').slice(0, -1).join('.')).replace(/([a-z])([A-Z])/g, '$1 $2')}
                                </Box>
                            ))
                    }
                </Box>
            </Box>
        </>
    );
}

const ContentPage = (
    { data, isloading }: {
        data: string;
        isloading: boolean
    }
) => {
    return (
        <>
            {
                isloading && <Loading />
            }
            {
                !data ? <>No post yet!</> :
                    <Markdown data={{ content: data }} />
            }
        </>
    );
}

export default page