import { styles } from '@/utils/styles';
import { Box, Container, Typography } from '@mui/material';
import React from 'react'
import ReactMarkdown from 'react-markdown';
import CodeContainer from './CodeContainer';
import Image from 'next/image';
import Link from 'next/link';
import { BlogsInterface, Data, EventsInterface } from '@/utils/Interfaces';
import '@/app/globals.css'
import { IBM_Plex_Mono, Libre_Baskerville } from 'next/font/google';
import rehypeRaw from 'rehype-raw'
import ContentStructure from './ContentStructure';

export const ibn = IBM_Plex_Mono({
    weight: '400',
    subsets: ['latin']
})
export const libre_Baskerville = Libre_Baskerville({
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
            customStyles={{
                ...customStyles,
                textAlign: 'left'
            }}
        >
            <ReactMarkdown
                className={` class`}
                components={{
                    h1: ({ children }) => <Typography variant='h1' className={ibn.className} sx={{
                        ...styles.heading('2em', '600'),
                        mb: 4, lineHeight: 1.25, p: 0
                    }}>{children}</Typography>,
                    h2: ({ children }) => <Typography variant='h2' className={ibn.className} sx={{
                        ...styles.heading({ md: '1.5em', xs: '1.5em' }, '600'),
                        mt: 3,
                        lineHeight: 1.25, p: 0
                    }}>{children}</Typography>,
                    h3: ({ children }) => <Typography variant='h3' className={ibn.className} sx={{
                        ...styles.heading({ md: '1.25em', xs: '1.25em' }, '600', 'none'),
                        mt: 3,
                        pl: 1.5, lineHeight: 1.25, p: 0
                    }}>{children}</Typography>,
                    h4: ({ children }) => <Typography variant='h4' className={ibn.className} sx={{
                        ...styles.heading('1em', '600', 'none'),
                        mt: 3,
                        lineHeight: 1.25, p: 0
                    }}>{children}</Typography>,
                    h5: ({ children }) => <Typography variant='h5' className={ibn.className} sx={{
                        ...styles.heading('.875em', '600', 'none'),
                        mt: 3,
                        lineHeight: 1.25, p: 0
                    }}>{children}</Typography>,
                    h6: ({ children }) => <Typography variant='h6' className={ibn.className} sx={{
                        ...styles.heading('.85em', '600', 'none'),
                        mt: 3,
                        lineHeight: 1.25, p: 0
                    }}>{children}</Typography>,
                    pre: ({ children }) => <CodeContainer children={children as {
                        props: {
                            children: string;
                        }
                    }} />,
                    p: ({ children }) => <Typography variant='body1' sx={{
                        fontSize: 16,
                        lineHeight: 1.5,
                        // textAlign: 'justify',
                        ml: { xs: 0, md: 3 },
                        mr: { md: 3, xs: 0 },
                        // 
                    }}>{children}</Typography>,
                    img: ({ src, alt }) => <Image className='image' style={{
                        alignSelf: 'center',
                        padding: 6,
                        borderRadius: 20
                    }} src={src as string} alt={alt as string} width={500} height={400} />,
                    ul: ({ children }) => <ul className='list'>{children}</ul>,
                    ol: ({ children }) => <ol className='olist'>{children}</ol>,
                    code: ({ children }) => <code style={{ ...styles.inlineCode() }}>{children}</code>,
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
                            background: 'gray',
                            height: 3,
                            borderRadius: '50px',
                            opacity: .3
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