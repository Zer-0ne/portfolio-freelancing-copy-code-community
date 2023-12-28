import { styles } from '@/utils/styles';
import { Box, Container, Typography } from '@mui/material';
import React from 'react'
import ReactMarkdown from 'react-markdown';
import CodeContainer from './CodeContainer';
import Image from 'next/image';
import Link from 'next/link';
import { BlogsInterface, Data, EventsInterface } from '@/utils/Interfaces';
import '@/app/globals.css'
import { IBM_Plex_Mono } from 'next/font/google';

export const ibn = IBM_Plex_Mono({
    weight: '400',
    subsets: ['latin']
})

const Markdown = (
    {
        data,
    }: {
        data: BlogsInterface | EventsInterface | Data
    }
) => {
    return (
        <Container
            sx={{
                padding: 2,
                display: "flex",
                flexDirection: 'column',
                justifyContent: "center",
                textAlign: 'justify'
                // alignItems:'center'
            }}
        >
            <ReactMarkdown
                className={ibn.className}
                components={{
                    h1: ({ children }) => <Typography variant='h1' sx={{
                        ...styles.heading(),
                        mb: 3
                    }}>{children}</Typography>,
                    h2: ({ children }) => <Typography variant='h2' sx={{
                        ...styles.heading(40, '500')
                    }}>{children}</Typography>,
                    h3: ({ children }) => <Typography variant='h3' sx={{
                        ...styles.heading(30, '500'),
                        mb: 4, mt: 2, p: 1
                    }}>{children}</Typography>,
                    h4: ({ children }) => <Typography variant='h4' sx={{
                        ...styles.heading(25, '300', 'none')
                    }}>{children}</Typography>,
                    h5: ({ children }) => <Typography variant='h5' sx={{
                        ...styles.heading(20, '300', 'none')
                    }}>{children}</Typography>,
                    pre: ({ children }) => <CodeContainer children={children as {
                        props: {
                            children: string;
                        }
                    }} />,
                    p: ({ children }) => <Typography variant='caption' sx={{
                        fontSize: 16,
                        lineHeight: 'normal',
                    }}>{children}</Typography>,
                    img: ({ src, alt }) => <Image className='image' style={{
                        alignSelf: 'center',
                        padding: 6,
                        borderRadius: 20
                    }} src={src as string} alt={alt as string} width={500} height={400} />,
                    ul: ({ children }) => <ul className='list'>{children}</ul>,
                    ol: ({ children }) => <ol className='olist'>{children}</ol>,
                    a: ({ children, href }) => (
                        <Link href={href as string}
                            style={{
                                color: 'white',
                                textDecoration: 'underline'

                            }}
                        >
                            {children}
                        </Link>
                    ),
                }}
            >
                {data?.content as string}
            </ReactMarkdown>
        </Container >
    )
}

export default Markdown