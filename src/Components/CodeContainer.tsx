import { styles } from '@/utils/styles';
import { ContentCopy, Done } from '@mui/icons-material';
import { Box } from '@mui/material'
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

            <Box id='text' sx={[styles.codeBox()]}>
                <Box
                    onClick={handleCopyCode}
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        zIndex: 2
                    }}
                >{
                        isCopied ?
                            <Done /> :
                            <ContentCopy
                            />

                    }
                </Box>
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
    </>
    )
}

export default CodeContainer