'use client'
import { Box, LinearProgress, Typography } from '@mui/material'
import React, { LegacyRef, useRef, useState } from 'react'
import { styles } from '@/utils/styles'
import { BlogsInterface, Data, InputToMoveCursor, Item } from '@/utils/Interfaces'
import { wordEditorFunc } from '@/utils/constant'
import dynamic from 'next/dynamic'

const Markdown = dynamic(() => import('./Markdown'))


const ReadmeField = ({
    setdata,
    propsData,
    Daata,
    isDisabled
}: {
    setdata: React.Dispatch<React.SetStateAction<Data | undefined>>;
    propsData: Data,
    isDisabled: boolean
    Daata: Data
}) => {
    const [markdownContent, setMarkdownContent] = useState(Daata ? Daata.content as string : '');
    const [isPreview, setIsPreview] = useState(false)
    const [isTrue, setIsTrue] = useState(false);
    const [isEnter, setIsEnter] = useState(false);
    const inputRef = React.useRef<HTMLDivElement>(null)
    const [counter, setCounter] = useState(2)
    const [progress, setProgress] = useState(0)
    const [data, setData] = useState<{
        name: string,
        code: string,
        type: boolean
    }>({
        name: '',
        code: '',
        type: false
    })
    const editorRef = useRef<LegacyRef<HTMLTextAreaElement> | undefined>();

    const moveCursor = async (Length?: number) => {
        const input = await editorRef?.current as InputToMoveCursor | undefined;

        if (input) {
            await input?.focus();

            // Move the cursor to the end
            const length = (!Length) ? input?.value?.length : Length;
            await input?.setSelectionRange(length, length);
        }
    };


    // handle click
    const handleClick = async (code: ((number?: number) => string) | ((image?: string) => string), name: string, toMoveCursor?: number) => {

        if (['ol', 'ul'].includes(name)) {
            if (!isTrue) {
                setCounter(2)
                setMarkdownContent((prevContent: string) => {
                    return prevContent + code();
                });
            }
            setIsTrue((prevState: boolean) => !prevState);

            // local this is not sent to blog and event page 
            setData({
                name,
                code: code(),
                type: !isTrue
            })
            setIsEnter(false)
            moveCursor()
            return
        }

        if (['image'].includes(name)) {
            await inputRef.current && inputRef.current?.click()
        } else {

            // You can implement logic to add bold markdown syntax
            setMarkdownContent((prevContent: string) => {
                return prevContent + code();
            });

            // Move cursor after setting the content
            setMarkdownContent((prevContent) => {
                (toMoveCursor) ?
                    moveCursor(prevContent.length + toMoveCursor) : moveCursor()
                return prevContent;
            });
        }
    };
    const extractImageLinks = (content: string): string[] => {
        // Regular expression to extract image links from Markdown-style image syntax
        const regex = /!\[.*?\]\('([^']+)'\)/g;
        const matches = [...content.matchAll(regex)];

        // Extract image links from the matched groups
        const imageLinks = matches.map(match => match[1]);

        return imageLinks;
    };


    const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        // Parse the content to extract image links
        const imageLinks: string[] = extractImageLinks(markdownContent);

        if (isEnter && isTrue) {

            // send the create blog and event page
            setdata((prevData) => ({
                ...prevData,
                content: value,
                contentImages: imageLinks
            }))
            // You can implement logic to add numbered list markdown syntax
            setMarkdownContent((prevContent: string) => {
                return prevContent + ((['ul', 'qoutes'].includes(data.name)) ? `\n${data.code}` : `\n${counter}. `);
            });

            // Move cursor after setting the content
            setMarkdownContent((prevContent) => {
                moveCursor();
                return prevContent;
            });

        } else {
            setMarkdownContent(value);

            // send the create blog and event page
            setdata((prevData) => ({
                ...prevData,
                content: value,
                contentImages: imageLinks
            }))
        }

    }


    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mb: 3,
                    gap: 2
                }}
            >
                <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type='file'
                    style={{ display: 'none' }}
                    onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                        // const { name, value } = e?.target
                        setProgress(10)
                        if (!e.target.files) return setProgress(0);
                        const file: File | null = e?.target.files[0];
                        const reader = new FileReader();
                        reader.onload = async (event) => {
                            setProgress(20)
                            if (event.target && event.target.result) {
                                const dataURL = await event.target.result.toString();
                                const uid = new Date().getTime().toString()
                                setProgress(60)

                                const { storeImage } = await import('@/utils/FetchFromApi')

                                const imageUrl = await storeImage(dataURL, `content/${propsData.title}`, uid) as string
                                setProgress(80)
                                setMarkdownContent((prevContent: string) => {
                                    return prevContent + `![${uid}](${imageUrl})`;
                                })
                                setProgress(100)
                            }
                        };
                        console.log(reader.readAsDataURL(file))
                        await reader.readAsDataURL(file);
                    }}
                // accept="image/*"
                />
                <Box
                    sx={{
                        display: 'flex',
                        minHeight: '75vh',
                        maxHeight: '80vh',
                        ...styles.customInput('', {}, 2),
                        flexDirection: 'column',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            borderBottom: '1px solid rgba(255,255,255,.25)',
                            flex: 1,
                            mb: 1,
                            gap: 2.5,
                            flexWrap: 'wrap',
                            padding: `0px 10px 10px 10px`,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {
                            wordEditorFunc.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        cursor: 'pointer'
                                    }}
                                    onClick={(e) => { !isPreview && handleClick(item.code, item.name, item?.toMoveCursor); }}
                                >
                                    {item.icon(data.type, item as Item)}
                                </Box>
                            ))
                        }
                        <Box sx={{
                            cursor: 'pointer',
                            background: isPreview ? 'white' : 'transparent',
                            color: isPreview ? 'black' : 'white',
                            padding: '1.6px 8px',
                            borderRadius: 2
                        }}
                            onClick={() => setIsPreview(prev => !prev)}
                        >Preview</Box>
                    </Box>
                    {
                        isPreview ? <Box
                            sx={{
                                flex: 100,
                                overflow: 'auto'
                            }}
                        >
                            <Markdown
                                data={Daata as Data}

                            /> </Box> :
                            <textarea
                                value={markdownContent}
                                placeholder='Write your content here...'
                                ref={editorRef as LegacyRef<HTMLTextAreaElement> | undefined}
                                onKeyDown={(event) => {

                                    // Check if the pressed key is Enter
                                    if (event.key === 'Enter') {

                                        // Your custom logic here
                                        setIsEnter(true);
                                        if (isEnter && isTrue) {
                                            setCounter(prev => prev + 1)
                                        }

                                    } else {
                                        setIsEnter(false)
                                    }
                                }}
                                onChange={handleChange}
                                style={{
                                    flex: 100,
                                    background: 'transparent',
                                    resize: 'none',
                                    padding: 4
                                }}
                            />
                    }

                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            width: '100%',
                            height: '10px'
                        }}
                    >
                        <LinearProgress variant="buffer" value={progress} valueBuffer={progress + 10} sx={{
                            width: 150, transition: 'all .3s ease-in-out', transform: (progress === 0 || progress === 100) ? 'scale(0)' : 'scale(1)',

                        }} />
                    </Box>
                </Box>
                <button
                    type='submit'
                    disabled={isDisabled}
                    style={styles.greenBtn() as React.CSSProperties | undefined}
                >
                    {
                        (isDisabled) ? 'Posting...' : 'Post'
                    }
                </button>
            </Box>
        </>
    )
}

export default ReadmeField