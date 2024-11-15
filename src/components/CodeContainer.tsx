import { styles } from '@/utils/styles';
import { ContentCopy, Done } from '@mui/icons-material';
import { Box, Typography } from '@mui/material'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { synthwave84 } from 'react-syntax-highlighter/dist/esm/styles/prism';
import React, { useState } from 'react'

const CodeContainer = ({ children }: {
    children: {
        props: {
            children: string
            className: string
        }
    }
}) => {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(children?.props?.children as string);
            setIsCopied(true)
        } catch (error) {
            console.error('Failed to copy code:', error);
        }
    };
    setTimeout(() => {
        setIsCopied(false)
    }, 2000);
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    // position: { xs: 'relative', md: 'static' },
                    // left: { xs: '14px', md: '0' },
                    // right: 0
                }}
            >
                <Box
                    sx={{
                        ...styles.codeBox({
                            mb: 0, mt: 1,
                            borderRadius: '12px 12px 0 0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '8px 16px',
                            alignItems: 'center'
                        })
                    }}
                >
                    <Typography
                        variant='caption'
                        sx={{
                            opacity: .7,
                            fontSize: '.8rem'
                        }}
                    >
                        {children.props.className?.replace("language-", "")}
                    </Typography>
                    <Box
                        onClick={handleCopyCode}
                        sx={{
                            fontSize: '.5rem !important',
                            cursor: 'pointer',
                            display: 'flex', opacity: .7,
                            zIndex: 2, alignItems: 'center', justifyContent: 'center', transition: 'all .2s ease-in-out'
                        }}
                    >{
                            isCopied ?
                                <Box sx={{ display: 'flex', gap: .6, alignItems: 'center', justifyContent: 'center' }} >
                                    <Done sx={{ fontSize: '1rem !important' }} />
                                    <Typography
                                        variant='caption'
                                        sx={{ fontSize: '.9rem !important', }}
                                    >copied</Typography>
                                </Box> :
                                <Box sx={{ display: 'flex', gap: .6, alignItems: 'center', justifyContent: 'center' }} >
                                    <ContentCopy sx={{ fontSize: '1rem !important' }} />
                                    <Typography
                                        variant='caption'
                                        sx={{ fontSize: '.9rem !important', }}
                                    >copy</Typography>
                                </Box>

                        }
                    </Box>
                </Box>
                <Box id='text' sx={[styles.codeBox({
                    mt: 0,
                    borderRadius: '0 0 12px 12px', mb: 1
                })]}>

                    {/* <pre
                    style={{
                        overflow: 'auto',
                    }}
                > */}
                    <SyntaxHighlighter customStyle={{ background: 'transparent !important', backgroundImage: 'transparent !important', textShadow: 'none !important', padding: 0, margin: 0 }} language={children.props.className?.replace("language-", "") as string} style={synthwave84}>
                        {children.props.children as string}
                    </SyntaxHighlighter>
                    {/* </pre> */}
                </Box>
            </Box>
        </>
    )
}

export default CodeContainer