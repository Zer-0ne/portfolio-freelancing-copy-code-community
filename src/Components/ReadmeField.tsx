'use client'
import { Box } from '@mui/material'
import React, { useRef, useState } from 'react'
import { styles } from '@/utils/styles'
import { InputToMoveCursor } from '@/utils/Interfaces'
import { wordEditorFunc } from '@/utils/constant'

export const ReadmeField = () => {
    const [markdownContent, setMarkdownContent] = useState('');
    const [isTrue, setIsTrue] = useState(false);
    const [isEnter, setIsEnter] = useState(false);
    const [counter, setCounter] = useState(2)
    const [data, setData] = useState<{
        name: string,
        code: string
    }>({
        name: '',
        code: ''
    })
    const [nametoCheck, setNametoCheck] = useState<string>('')
    const editorRef = useRef();

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
    const handleClick = (code: (i?: number) => string, name: string, toMoveCursor?: number) => {

        const codeString = code()

        if (['qoutes', 'ol', 'ul'].includes(name)) {
            if (!isTrue) {
                setCounter(2)
                setMarkdownContent((prevContent: string) => {
                    return prevContent + codeString;
                });
            }
            setIsTrue((prevState: boolean) => !prevState);
            setData({
                name,
                code: codeString
            })
            setIsEnter(false)
            moveCursor()
            return
        }

        // You can implement logic to add bold markdown syntax
        setMarkdownContent((prevContent: string) => {
            return prevContent + codeString;
        });

        // Move cursor after setting the content
        setMarkdownContent((prevContent) => {
            (toMoveCursor) ?
                moveCursor(prevContent.length + toMoveCursor) : moveCursor()
            return prevContent;
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (isEnter && isTrue) {

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
        }

    }

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    minHeight: '70vh',
                    ...styles.customInput('', {}, 2),
                    flexDirection: 'column'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        borderBottom: '1px solid rgba(255,255,255,.25)',
                        flex: 1,
                        height: 40,
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
                                onClick={(e) => { handleClick(item.code, item.name, item?.toMoveCursor); console.log(e); setNametoCheck(item.name) }}
                            >
                                {item.icon(isTrue, data.name, nametoCheck)}
                            </Box>
                        ))
                    }
                </Box>
                <input
                    type='text'
                    value={markdownContent}
                    placeholder='Write your content here...'
                    ref={editorRef}
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
            </Box>
        </>
    )
}
