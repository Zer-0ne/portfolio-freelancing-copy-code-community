import { styles } from '@/utils/styles';
import { ContentCopy, Done } from '@mui/icons-material';
import { Box } from '@mui/material'
import React, { JSXElementConstructor, useState } from 'react'

const CodeContainer = ({ children }: {
    children: {
        props: {
            children: string
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
                <pre
                    style={{
                        position: 'relative'
                    }}
                >
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
                    {children.props.children}
                </pre>
            </Box>
        </>
    )
}

export default CodeContainer