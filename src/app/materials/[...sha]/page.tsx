'use client'
import { Box } from '@mui/material'
import { styles } from '@/utils/styles';
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { NavigateNext } from '@mui/icons-material';
import dynamic from 'next/dynamic';
import useMediaQuery from '@mui/material/useMediaQuery';

const Loading = dynamic(() => import('@/Components/Loading'))
const Markdown = dynamic(() => import('@/Components/Markdown'))


const page = () => {
    const { sha }: any = useParams()
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

            // scroll on top
            decode && await window.scrollTo({
                top: 0,
                behavior: 'smooth', // Optional: Smooth scrolling effect
            });
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
    const mobileView = useMediaQuery('(max-width:1000px)');
    const scrollRef = useRef<any>(null);

    const filteredEvents = navData?.filter(
        (item) =>
            item?.path.toLowerCase().includes(searchInput.toLowerCase())
    );
    const [isVisible, setIsVisible] = useState(true);
    let lastScrollTop = 0;

    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Scroll Down
            setIsVisible(false);
        } else {
            // Scroll Up
            setIsVisible(true);
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    useEffect(() => {
        if (scrollRef.current) {
            const selectedItem: any = Array.from(scrollRef.current.children).find((child: any) => {
                return child.getAttribute('data-url') === url;
            });

            if (selectedItem) {
                selectedItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center', // Center the item in the view
                });
            }
        }
    }, [url]);
    return (
        <>

            <Box
                sx={{
                    position: 'fixed', display: 'flex',
                    top: { md: 'calc(50px + 24px + 22px)', xs: 'auto' }, bottom: { md: 0, xs: isVisible ? 10 : '-50px' }, transform: { md: 'scale(1)', xs: isVisible ? 'scale(1)' : 'scale(0)' }, width: { xs: 'auto', xl: '10vw' }, left: { xs: 13, xl: 10 }, zIndex: 10,
                    ...styles.glassphorism(), gap: { md: 2, xs: 0 },
                    p: 2, mb: { md: 2, xs: 0 }, pt: { md: 3, xs: 2 }, pb: { md: 3, xs: 2 }, transition: 'all .5s ease-in-out', flexDirection: 'column', right: { xs: 13, md: 'auto' }, height: { xs: 'auto', md: 'auto' },
                    '::after': {
                        content: '""',
                        position: 'absolute',
                        borderRadius: '16px',
                        background: { xs: 'linear-gradient(90deg, rgba(0,0,0,0.9585084033613446) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 100%)', md: 'transparent' },
                        display: { xs: 'flex', md: 'none' },
                        inset: 0,
                        zIndex: 1,
                        pointerEvents: 'none'
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        right: -50, top: 10, p: '12px 8px', ...styles.glassphorism(), transition: 'all .5s ease-in-out',
                        cursor: 'pointer', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: { xs: mobileView ? 'none' : 'block', md: 'block', xl: 'none' }
                    }}
                    onClick={() => { setIsOpen(prev => !prev) }}
                >
                    <NavigateNext />
                </Box>
                <Box>
                    <input placeholder='Search...' onChange={(e) => setSearchInput(e.target.value)} style={{
                        ...styles.customInput(1, {
                            width: '100%',
                        }),
                        display: mobileView ? 'none' : 'flex'
                    }} />
                </Box>
                <Box ref={scrollRef} sx={{ overflow: 'auto', display: 'flex', flexDirection: { md: 'column', xs: 'row' }, gap: { md: 1.5, xs: 2 }, paddingX: { xs: 3, md: 0 } }}>

                    {
                        !navData ? <>No post yet!</> :
                            filteredEvents?.map((item, index) => (
                                <Box data-url={item.url} onClick={() => { setUrl(item.url) }} key={index} sx={{
                                    cursor: 'pointer',
                                    opacity: (item.url).includes(url) ? 1 : .5,
                                    transition: 'all .5s ease-in-out',
                                    textWrap: { md: 'wrap', xs: 'nowrap' },
                                    ':hover': {
                                        opacity: 1,
                                        transform: 'scale(1.018)'
                                    }
                                }}>
                                    {/* {decodeURIComponent(sha.toString()).toString()} */}
                                    {item.path.replace(/^[0-9.]+/, '').replace(/\..+$/, '')}
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