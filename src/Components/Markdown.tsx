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
import { colors } from '@/utils/colors';
import rehypeRaw from 'rehype-raw'
import ContentStructure from './ContentStructure';

export const ibn = IBM_Plex_Mono({
    weight: '400',
    subsets: ['latin']
})

const Markdown = (
    {
        data,
        customStyles
    }: {
        data: BlogsInterface | EventsInterface | Data;
        customStyles?: React.CSSProperties;
    }
) => {
    return (
        <ContentStructure
            customStyles={customStyles}
        >
            <ReactMarkdown
                className={ibn.className}
                components={{
                    h1: ({ children }) => <Typography variant='h1' sx={{
                        ...styles.heading(),
                        mb: 3
                    }}>{children}</Typography>,
                    h2: ({ children }) => <Typography variant='h2' sx={{
                        ...styles.heading({ md: 40, xs: 25 }, '500'),
                        mt: 3,
                        mb: 3,
                    }}>{children}</Typography>,
                    h3: ({ children }) => <Typography variant='h3' sx={{
                        ...styles.heading({ md: 30, xs: 19 }, '500', 'none'),
                        mb: 1, mt: 1, p: 1, pl: 1.5
                    }}>{children}</Typography>,
                    h4: ({ children }) => <Typography variant='h4' sx={{
                        ...styles.heading(25, '300', 'none'),
                        pl: 2
                    }}>{children}</Typography>,
                    h5: ({ children }) => <Typography variant='h5' sx={{
                        ...styles.heading(20, '300', 'none')
                    }}>{children}</Typography>,
                    pre: ({ children }) => <CodeContainer children={children as {
                        props: {
                            children: string;
                        }
                    }} />,
                    p: ({ children }) => <Typography variant='body1' sx={{
                        fontSize: 16,
                        lineHeight: 'normal',
                        // textAlign: 'justify',
                        ml: 3,
                        mr: 3,
                        mb: 2
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
                    hr: ({ children }) => <hr
                        style={{
                            marginTop: '2rem',
                            marginBottom: '1rem',
                            color: 'gray'
                        }}
                    />,
                    // iframe:({src})=><iframe
                    //     style={{
                    //         margin:'0 auto'
                    //     }}
                    //     src={src}
                    // ></iframe>
                }}
                rehypePlugins={[rehypeRaw]}
            >
                {data?.content as string}
            </ReactMarkdown>
        </ContentStructure>
    )
}

export default Markdown