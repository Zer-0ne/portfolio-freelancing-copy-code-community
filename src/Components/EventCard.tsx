import { Box, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { styles } from '@/utils/styles'
import Image from 'next/image'
import { AssistantPhotoRounded, CalendarToday, DeleteRounded, EditRounded, LanguageOutlined, LocalOfferRounded } from '@mui/icons-material'
import { colors } from '@/utils/colors'
import { EventsInterface, } from '@/utils/Interfaces'
import { deletePost } from '@/utils/FetchFromApi'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { useRouter } from 'next/navigation'
import dp from '@/app/favicon.ico'
import { updateEvent } from '@/slices/eventsSlice'

const EventCard = ({
    item,
    fetchData,
}: {
    item: EventsInterface;
    fetchData: () => Promise<void>;
}) => {
    const { session } = useSelector((state: RootState) => state.session)
    const dispatch = useDispatch<AppDispatch>()
    const cardRef = useRef<HTMLDivElement>(null);
    const router = useRouter()
    const [isVisible, setIsVisible] = React.useState(false);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5, // Adjust the threshold as needed
        };

        const callback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                setIsVisible(entry.isIntersecting);
            });
        };

        const observer = new IntersectionObserver(callback, options);

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        // Cleanup the observer when the component unmounts
        return () => {
            observer.disconnect();
        };
    }, []);

    const getRelativeDate = (targetDate: Date | string) => {
        const currentDate = new Date() as any;

        // Parse the target date
        const parsedTargetDate = new Date(targetDate);

        // Calculate the difference in milliseconds
        const timeDifference = parsedTargetDate as any - currentDate as any;

        // Calculate the difference in days
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        if (daysDifference > 0) {
            // Target date is in the future, return days left
            return `${daysDifference} day${daysDifference !== 1 ? 's' : ''} left`;
        } else if (daysDifference < 0) {
            // Target date is in the past, return days ago
            return `${-daysDifference} day${-daysDifference !== 1 ? 's' : ''} ago`;
        } else {
            // Target date is today
            return 'Today';
        }
    }

    const deleteEvent = async () => {
        await deletePost(item?._id, 'event', item)
        dispatch(updateEvent({ id: item?._id, updatedEvent: null }));
        await fetchData()
    }

    const handleEdit = async () => {
        router.push(`/create/event/${item._id}`);
    }

    return (
        <Box
            ref={cardRef}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: .5,
                transition: 'all .5s ease-in-out',
                opacity: isVisible ? 1 : 0,
                transform: `scale(${!isVisible ? -.8 : 1})`,
            }}
        >
            <Link href={`/events/${item._id}`}>
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
                            src={item.image || dp}
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
                                {getRelativeDate(item.eventDate)}
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
                                fontSize={12}
                                sx={{
                                    padding: '2px 13px',
                                    borderRadius: 7,
                                    border: `1px solid ${colors.transparentGrey}`,
                                    textAlign: 'center'
                                }}
                            >Copy Code</Typography>
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
                                {item.eventDate}
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
            </Link>
            <Box
                sx={{
                    display: ['admin', 'moderator'].includes(session[0]?.role) ? 'flex' : 'none',
                    gap: 1,
                    opacity: .5,
                    justifyContent: 'space-around',
                    p: 1,
                    alignItems: 'center',
                    ...styles.glassphorism('', '0 0 12px 12px'),
                }}
            >
                <EditRounded
                    sx={{
                        fontSize: 25,
                        padding: .5,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        ':hover': {
                            background: 'white',
                            color: 'black'
                        }
                    }}
                    onClick={handleEdit}
                />
                <DeleteRounded
                    onClick={deleteEvent}
                    sx={{
                        fontSize: 25,
                        padding: .5,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        ':hover': {
                            background: 'red',
                            color: 'white'
                        }
                    }}
                />
            </Box>
        </Box>
    )
}

export default EventCard