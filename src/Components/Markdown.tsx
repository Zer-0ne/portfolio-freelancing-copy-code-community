import { styles } from '@/utils/styles';
import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogsInterface, Data, EventsInterface } from '@/utils/Interfaces';
import '@/app/globals.css';
import { IBM_Plex_Mono, Libre_Baskerville } from 'next/font/google';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import dynamic from 'next/dynamic';

const ContentStructure = dynamic(() => import('./ContentStructure'));
const CodeContainer = dynamic(() => import('./CodeContainer'));
const ReactMarkdown = dynamic(() => import('react-markdown'));

export const ibn = IBM_Plex_Mono({
    weight: '400',
    subsets: ['latin'],
});
export const libre_Baskerville = Libre_Baskerville({
    weight: '400',
    subsets: ['latin'],
});

const Markdown = ({
    data,
    customStyles,
}: {
    data: BlogsInterface | EventsInterface | Data;
    customStyles?: React.CSSProperties;
}) => {
    return (
        <ContentStructure
            customStyles={{
                ...customStyles,
                textAlign: 'left',
                padding: 2,
                position: 'relative'
                
                // maxWidth:'1000px',
            }}
        >
            <Box
                sx={{
                    position: 'absolute'
                    , height: '1px',
                    left: {md:'-15px',xs:'-0px'},
                    right: {md:'-15px',xs:'-0px'}
                    , top: '15px',
                    background:'linear-gradient(90deg, rgba(0,0,0,0) 0%,rgba(255,255,255,.19) 5%, rgba(255,255,255,.19) 50%,rgba(255,255,255,.19) 95%, rgba(0,0,0,0) 100%)'
                }}
            />
            <Box
                sx={{
                    position: 'absolute'
                    , height: '1px',
                    left: {md:'-15px',xs:'-0px'},
                    right: {md:'-15px',xs:'-0px'}
                    , bottom: '15px',
                    background:'linear-gradient(90deg, rgba(0,0,0,0) 0%,rgba(255,255,255,.19) 5%, rgba(255,255,255,.19) 50%,rgba(255,255,255,.19) 95%, rgba(0,0,0,0) 100%)'
                }}
            />
            <Box
                sx={{
                    position: 'absolute'
                    , width: '1px',
                    top: '-20px',
                    bottom: '-20px'
                    , left: '15px',
                    background:'linear-gradient(0deg, rgba(0,0,0,0) 0%,rgba(255,255,255,.19) 1%, rgba(255,255,255,.19) 50%,rgba(255,255,255,.19) 99%, rgba(0,0,0,0) 100%)'
                }}
            />
            <Box
                sx={{
                    position: 'absolute'
                    , width: '1px',
                    top: '-20px',
                    bottom: '-20px'
                    , right: '15px',
                    background:'linear-gradient(0deg, rgba(0,0,0,0) 0%,rgba(255,255,255,.19) 1%, rgba(255,255,255,.19) 50%,rgba(255,255,255,.19) 99%, rgba(0,0,0,0) 100%)'
                }}
            />
            <ReactMarkdown
                className={` class`}
                components={{
                    h1: ({ children }) => (
                        <Typography
                            variant='h1'
                            className={ibn.className}
                            sx={{
                                ...styles.heading('2em', '600'),
                                mb: 4,
                                lineHeight: 1.25,
                                p: 0,
                            }}
                        >
                            {children}
                        </Typography>
                    ),
                    h2: ({ children }) => (
                        <Typography
                            variant='h2'
                            className={ibn.className}
                            sx={{
                                ...styles.heading({ md: '1.5em', xs: '1.5em' }, '600'),
                                lineHeight: 1.25,
                                p: 0,
                            }}
                        >
                            {children}
                        </Typography>
                    ),
                    h3: ({ children }) => (
                        <Typography
                            variant='h3'
                            className={ibn.className}
                            sx={{
                                ...styles.heading({ md: '1.25em', xs: '1.25em' }, '600', 'none'),
                                pl: 1.5,
                                lineHeight: 1.25,
                                p: 0,
                            }}
                        >
                            {children}
                        </Typography>
                    ),
                    h4: ({ children }) => (
                        <Typography
                            variant='h4'
                            className={ibn.className}
                            sx={{
                                ...styles.heading('1em', '600', 'none'),
                                lineHeight: 1.25,
                                p: 0,
                            }}
                        >
                            {children}
                        </Typography>
                    ),
                    h5: ({ children }) => (
                        <Typography
                            variant='h5'
                            className={ibn.className}
                            sx={{
                                ...styles.heading('.875em', '600', 'none'),
                                lineHeight: 1.25,
                                p: 0,
                            }}
                        >
                            {children}
                        </Typography>
                    ),
                    h6: ({ children }) => (
                        <Typography
                            variant='h6'
                            className={ibn.className}
                            sx={{
                                ...styles.heading('.85em', '600', 'none'),
                                lineHeight: 1.25,
                                p: 0,
                            }}
                        >
                            {children}
                        </Typography>
                    ),
                    pre: ({ children }) => (
                        <CodeContainer
                            children={children as {
                                props: {
                                    children: string;
                                    className: string;
                                };
                            }}
                        />
                    ),
                    p: ({ children }) => (
                        <Typography
                            variant='body1'
                            sx={{
                                fontSize: 16,
                                lineHeight: 1.5,
                                ml: { xs: 0, md: 0 },
                                mr: { md: 0, xs: 0 },
                            }}
                        >
                            {children}
                        </Typography>
                    ),
                    img: ({ src, alt }) => (
                        <Image
                            className='image'
                            style={{
                                alignSelf: 'center',
                                padding: 6,
                                borderRadius: 20,
                            }}
                            src={src as string}
                            alt={alt as string}
                            width={500}
                            height={400}
                        />
                    ),
                    ul: ({ children }) => <ul className='list'>{children}</ul>,
                    ol: ({ children }) => <ol className='olist'>{children}</ol>,
                    code: ({ children }) => (
                        <code style={{ ...styles.inlineCode() }}>{children}</code>
                    ),
                    a: ({ children, href }) => (
                        <Link
                            href={href as string}
                            style={{
                                color: 'white',
                                textDecoration: 'underline',
                            }}
                        >
                            {children}
                        </Link>
                    ),
                    hr: ({ children }) => (
                        <hr
                            style={{
                                marginTop: '2rem',
                                marginBottom: '1rem',
                                background: 'gray',
                                height: 3,
                                borderRadius: '50px',
                                opacity: 0.3,
                            }}
                        />
                    ),
                    // Table components
                    table: ({ children }) => (
                        <Box sx={{ overflowX: 'auto', marginBottom: 2 }}>
                            <table style={{ width: 'auto', borderCollapse: 'collapse' }}>
                                {children}
                            </table>
                        </Box>
                    ),
                    thead: ({ children }) => (
                        <thead style={{}}>{children}</thead>
                    ),
                    tbody: ({ children }) => <tbody>{children}</tbody>,
                    tr: ({ children }) => (
                        <tr style={{ border: '1px solid #dddddd2b', textTransform: 'capitalize' }}>{children}</tr>
                    ),
                    th: ({ children }) => (
                        <th
                            style={{
                                padding: '10px',
                                textAlign: 'center',
                                background: '#2020208a',
                                // borderBottom: '1px solid #ddd',
                                textTransform: 'capitalize',
                                borderLeft: '1px solid #dddddd2b', borderRight: '1px solid #dddddd2b',
                            }}
                        >
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td style={{ padding: '10px', borderLeft: '1px solid #dddddd2b', borderRight: '1px solid #dddddd2b', textAlign: 'center' }}>
                            {children}
                        </td>
                    ),
                }}
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
            >
                {data?.content as string}
            </ReactMarkdown>
        </ContentStructure>
    );
};

export default Markdown;
