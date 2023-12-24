import { styles } from '@/utils/styles';
import { Box, Container, Typography } from '@mui/material';
import React from 'react'
import ReactMarkdown from 'react-markdown';
import CodeContainer from './CodeContainer';
import Image from 'next/image';
import Link from 'next/link';
import { BlogsInterface, EventsInterface } from '@/utils/Interfaces';
import '@/app/globals.css'
const Markdown = (
    {
        data,
    }: {
        data: BlogsInterface | EventsInterface
    }
) => {
    return (
        <Container
            sx={{
                padding: 2,
                display: "flex",
                flexDirection: 'column',
                justifyContent: "center",
                // alignItems:'center'
            }}
        >
            <ReactMarkdown
                components={{
                    h1: ({ children }) => <Typography variant='h1' sx={{
                        ...styles.heading()
                    }}>{children}</Typography>,
                    h2: ({ children }) => <Typography variant='h2' sx={{
                        ...styles.heading(40, '500')
                    }}>{children}</Typography>,
                    h3: ({ children }) => <Typography variant='h3' sx={{
                        ...styles.heading(30, '400')
                    }}>{children}</Typography>,
                    h4: ({ children }) => <Typography variant='h4' sx={{
                        ...styles.heading(25, '300')
                    }}>{children}</Typography>,
                    h5: ({ children }) => <Typography variant='h4' sx={{
                        ...styles.heading(20, '300')
                    }}>{children}</Typography>,
                    pre: ({ children }) => <CodeContainer children={children as {
                        props: {
                            children: string
                        }
                    }} />,
                    p: ({ children }) => <Typography variant='caption' sx={{
                        fontSize: 16
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
                                color: 'blue',
                                textDecoration: 'underline'

                            }}
                        >
                            {children}
                        </Link>
                    ),
                }}
            >
                {data?.content}
            </ReactMarkdown>
        </Container >
    )
}

export default Markdown