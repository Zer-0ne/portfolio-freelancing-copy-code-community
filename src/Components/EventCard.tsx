import { Box, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import Image from 'next/image'
import { AssistantPhotoRounded, CalendarToday, LanguageOutlined, LocalOfferRounded } from '@mui/icons-material'
import { colors } from '@/utils/colors'
import { EventsInterface } from '@/utils/Interfaces'
const EventCard = ({
    item
}: {
    item: EventsInterface
}) => {
    return (
        <>
            <Box
                sx={styles.eventCard(item.label)}
            >
                {/* image box */}
                <Box
                    sx={{
                        display: 'flex',
                        flex: { xs: 10, md: 1, xl: 1 },
                        minWidth: 200
                    }}
                >
                    <Image
                        src={item.image}
                        alt='img'
                        width={200}
                        height={200}
                        fill={false}
                        style={{
                            flex: 1
                        }}
                    />
                </Box>

                {/* Heading and description */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        flex: 5,
                        flexDirection: 'column',
                    }}
                >
                    {/* Heading */}
                    <Typography
                        variant='h5'
                        sx={{
                            fontWeight: '500'
                        }}
                    >
                        {item.title}
                    </Typography>

                    {/* Details modes participants */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: { xl: 5, md: 5, xs: 2 },
                            margin: { xl: '5px 0', md: '5px 0', xs: '0 0 5px 0' },
                            flexWrap: 'wrap',
                            justifyContent: { xs: 'center', md: 'normal', xl: 'normal' }
                        }}
                    >
                        {/* Date and time */}
                        <Box
                            sx={styles.dateTimeBox()}
                        >
                            {item.headingDate}
                        </Box>

                        {/* mode of the events online or offline  */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: .8,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <LanguageOutlined
                                sx={{
                                    fontSize: 19
                                }}
                            />
                            <Typography
                                variant='caption'
                                sx={{
                                    fontSize: 15
                                }}
                            >
                                {item.mode}
                            </Typography>
                        </Box>

                        {/* members participants */}
                        <Typography
                            variant='caption'
                            sx={{
                                fontSize: 15,
                                fontWeight: '600',
                            }}
                        >{item.participants}
                            <Typography
                                variant='caption'
                                sx={{
                                    fontSize: 15,
                                    ml: .5
                                }}
                            >participants</Typography>
                        </Typography>
                    </Box>

                    {/* Description */}
                    <Typography
                        variant='body2'
                        sx={{
                            textAlign: 'justify',
                            ml: 1,
                            mt: 1,
                            overflow: 'hidden'
                        }}
                    >
                        {item.description}
                    </Typography>
                </Box>

                {/* organizer keywords and other details */}
                <Box
                    sx={styles.eventCardRight()}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <AssistantPhotoRounded
                            sx={{
                                fontSize: 20
                            }}
                        />
                        <Typography
                            variant='caption'
                            fontSize={15}
                            sx={{
                                padding: '2px 13px',
                                borderRadius: 7,
                                border: `1px solid ${colors.transparentGrey}`
                            }}
                        >Sahil khan</Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <CalendarToday
                            sx={{
                                fontSize: 15
                            }}
                        />
                        <Typography
                            variant='caption'
                            fontSize={15}

                        >
                            {item.calenderDate}
                        </Typography>
                    </Box>


                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <LocalOfferRounded
                            sx={{
                                fontSize: 15
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}
                        >
                            <Typography
                                variant='caption'
                                fontSize={15}
                            >
                                {item.tag}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default EventCard