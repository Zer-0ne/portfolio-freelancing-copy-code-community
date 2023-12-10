import { Box, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import { CodeRounded, FormatAlignCenterRounded, FormatAlignJustifyRounded, FormatAlignLeftRounded, FormatAlignRightRounded, FormatBoldRounded, FormatItalic, FormatListBulleted, FormatListNumbered, FormatQuoteRounded, FormatStrikethroughRounded, FormatUnderlinedRounded, ImageRounded, LinkRounded } from '@mui/icons-material'

export const ReadmeField = () => {
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
                    <FormatBoldRounded
                        sx={{
                            padding: '2px 3px',
                            fontSize: 28,
                            borderRadius: 1,
                            ':hover': {
                                color: 'black',
                                background: 'white'
                            }
                        }}
                    />
                    <FormatItalic
                        sx={{
                            padding: '2px 3px',
                            fontSize: 28,
                            borderRadius: 1,
                            ':hover': {
                                color: 'black',
                                background: 'white'
                            }
                        }}
                    />
                    <FormatUnderlinedRounded
                        sx={{
                            padding: '2px 3px',
                            fontSize: 28,
                            borderRadius: 1,
                            ':hover': {
                                color: 'black',
                                background: 'white'
                            }
                        }}
                    />
                    <ImageRounded
                        sx={{
                            padding: '2px 3px',
                            fontSize: 28,
                            borderRadius: 1,
                            ':hover': {
                                color: 'black',
                                background: 'white'
                            }
                        }}
                    />
                    <FormatListBulleted
                        sx={{
                            padding: '2px 3px',
                            fontSize: 28,
                            borderRadius: 1,
                            ':hover': {
                                color: 'black',
                                background: 'white'
                            }
                        }}
                    />
                    <FormatListNumbered
                        sx={{
                            padding: '2px 3px',
                            fontSize: 28,
                            borderRadius: 1,
                            ':hover': {
                                color: 'black',
                                background: 'white'
                            }
                        }}
                    />
                    <CodeRounded
                        sx={{
                            padding: '2px 3px',
                            fontSize: 28,
                            borderRadius: 1,
                            ':hover': {
                                color: 'black',
                                background: 'white'
                            }
                        }}
                    />
                    <FormatAlignCenterRounded
                        sx={{
                            padding: '2px 3px',
                            fontSize: 28,
                            borderRadius: 1,
                            ':hover': {
                                color: 'black',
                                background: 'white'
                            }
                        }}
                    />
                    <FormatAlignJustifyRounded
                        sx={{
                            padding: '2px 3px',
                            fontSize: 28,
                            borderRadius: 1,
                            ':hover': {
                                color: 'black',
                                background: 'white'
                            }
                        }}
                    />
                    <FormatAlignRightRounded
                        sx={{
                            padding: '2px 3px',
                            fontSize: 28,
                            borderRadius: 1,
                            ':hover': {
                                color: 'black',
                                background: 'white'
                            }
                        }}
                    />
                    <FormatAlignLeftRounded
                        sx={{
                            padding: '2px 3px',
                            fontSiz28e: 28,
                            borderRadius: 1,
                            ':hover': {
                                color: 'black',
                                background: 'white'
                            }
                        }}
                    />
                    <LinkRounded
                        sx={{
                            padding: '2px 3px',
                            fontSize: 28,
                            borderRadius: 1,
                            ':hover': {
                                color: 'black',
                                background: 'white'
                            }
                        }}
                    />
                    <FormatQuoteRounded
                        sx={{
                            padding: '2px 3px',
                            fontSize: 28,
                            borderRadius: 1,
                            ':hover': {
                                color: 'black',
                                background: 'white'
                            }
                        }}
                    />
                    <FormatStrikethroughRounded
                        sx={{
                            padding: '2px 3px',
                            fontSize: 28,
                            borderRadius: 1,
                            ':hover': {
                                color: 'black',
                                background: 'white'
                            }
                        }}
                    />
                    <Typography variant='caption' sx={{
                        padding: '2px 3px',
                        fontSize: 18,
                        fontWeight: 900,
                        borderRadius: 1,
                        ':hover': {
                            background: 'white',
                            color: 'black'
                        }
                    }}>H1</Typography>
                    <Typography variant='caption' sx={{
                        padding: '2px 3px',
                        fontSize: 18,
                        fontWeight: 900,
                        borderRadius: 1,
                        ':hover': {
                            background: 'white',
                            color: 'black'
                        }
                    }}>H2</Typography>
                    <Typography variant='caption' sx={{
                        padding: '2px 3px',
                        fontSize: 18,
                        fontWeight: 900,
                        borderRadius: 1,
                        ':hover': {
                            background: 'white',
                            color: 'black'
                        }
                    }}>H3</Typography>
                    <Typography variant='caption' sx={{
                        padding: '2px 3px',
                        fontSize: 18,
                        fontWeight: 900,
                        borderRadius: 1,
                        ':hover': {
                            background: 'white',
                            color: 'black'
                        }
                    }}>H4</Typography>
                    <Typography variant='caption' sx={{
                        padding: '2px 3px',
                        fontSize: 18,
                        fontWeight: 900,
                        borderRadius: 1,
                        ':hover': {
                            background: 'white',
                            color: 'black'
                        }
                    }}>H5</Typography>
                    <Typography variant='caption' sx={{
                        padding: '2px 3px',
                        fontSize: 18,
                        fontWeight: 900,
                        borderRadius: 1,
                        ':hover': {
                            background: 'white',
                            color: 'black'
                        }
                    }}>H6</Typography>
                    <Typography variant='caption' sx={{
                        padding: '2px 3px',
                        fontSize: 18,
                        fontWeight: 900,
                        borderRadius: 1,
                        ':hover': {
                            background: 'white',
                            color: 'black'
                        }
                    }}>P</Typography>
                </Box>
                <textarea
                    style={{
                        flex: 100,
                        background:'transparent',
                        resize:'none'
                    }}
                />
            </Box>
        </>
    )
}
