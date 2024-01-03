import { Avatar, Box, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { styles } from '@/utils/styles'
import { BlogsInterface} from '@/utils/Interfaces'
import { DeleteRounded, EditRounded } from '@mui/icons-material'
import { IBM_Plex_Mono, Kalam, Libre_Baskerville } from 'next/font/google'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const kalam = Kalam({
    subsets: ['latin'],
    weight: '700'
});

export const ibn = IBM_Plex_Mono({
    weight: '400',
    subsets: ['latin']
})


export const libre_Baskerville = Libre_Baskerville({
    weight: '400',
    subsets: ['latin']
})



const BlogCard = ({
    item,
    fetchData
}: {
    item: BlogsInterface,
    fetchData: () => Promise<void>;
}) => {
    const deleteBlog = async () => {
        const {deletePost} = await import('@/utils/FetchFromApi')

        await deletePost(item?._id, 'blog', item)
        await fetchData()
    }
    const { session } = useSelector((state: RootState) => state.session)
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = React.useState(false);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5, // Adjust the threshold as needed
        };

        const callback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                setIsVisible(entry.isIntersecting);
            });
        };

        const observer = new IntersectionObserver(callback, options);

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        // Cleanup the observer when the component unmounts
        return () => {
            observer.disconnect();
        };
    }, []);
    return (
        <Box
            ref={cardRef}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: .5,
                transition: 'all 0.5s ease-in-out',
                opacity: isVisible ? 1 : 0,
                transform: `scale(${!isVisible ? -.8 : 1})`,
            }}
        >
            <Link href={`/blogs/${item._id}`}>
                <Box
                    sx={styles.blogCard(session as {
                        role: string
                    }[])}
                >

                    <Typography
                        variant='h5'
                        className={libre_Baskerville.className}
                    >
                        {item.title}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            ml: .5
                        }}
                    >
                        <Typography
                            variant='caption'
                            sx={{
                                mb: .7,
                                mt: 0,
                                ml: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: .8,
                                position: 'relative',
                                '::after': {
                                    content: '""',
                                    position: 'absolute',
                                    width: 3,
                                    height: 3,
                                    borderRadius: '50%',
                                    right: -9.5,
                                    top: '50%',
                                    bottom: '50%',
                                    background: 'white',
                                    opacity: .7
                                }
                                // alignSelf:'end'
                            }}
                            className={ibn.className}
                        >
                            {/* <Avatar
                                sx={{ width: 22, height: 22 }}
                            /> */}
                            Copy Code
                        </Typography>
                        <Typography
                            variant='caption'
                            sx={{
                                mb: .5,
                                mt: 0,
                                ml: 0,
                                opacity: .7,
                                // alignSelf:'end'
                            }}
                            className={ibn.className}
                        >
                            {item.updatedAt?.slice(0, 10)}
                        </Typography>
                    </Box>
                    <Typography
                        variant='caption'
                        className={ibn.className}
                    >
                        {item.description}
                    </Typography>
                </Box>

            </Link >
            <Box
                sx={{
                    display: ['admin', 'moderator'].includes(session[0]?.role) ? 'flex' : 'none',
                    gap: 1,
                    opacity: .5,
                    justifyContent: 'space-around',
                    p: 1,
                    alignItems: 'center',
                    ...styles.glassphorism('', '0 0 12px 12px'),
                    ml: 2
                }}
            >
                <EditRounded
                    sx={{
                        fontSize: 25,
                        padding: .5,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        ':hover': {
                            background: 'white',
                            color: 'black'
                        }
                    }}
                />
                <DeleteRounded
                    onClick={deleteBlog}
                    sx={{
                        fontSize: 25,
                        padding: .5,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        ':hover': {
                            background: 'red',
                            color: 'white'
                        }
                    }}
                />
            </Box>
        </Box >
    )
}

export default BlogCard