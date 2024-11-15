'use client';
import { Box, Container } from '@mui/material';
import { styles } from '@/utils/styles';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { NavigateNext } from '@mui/icons-material';
import dynamic from 'next/dynamic';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TreeNode } from '@/utils/FetchFromApi';

// Dynamically import components for loading and markdown rendering
const Loading = dynamic(() => import('@/components/Loading'));
const Markdown = dynamic(() => import('@/components/Markdown'));

const Page = () => {
    const { sha }: any = useParams(); // Get the SHA parameters from the URL
    const [url, setUrl] = useState<string>(''); // State to hold the URL of the specific material
    const [data, setData] = useState<string>(); // State to hold the content data
    const [treeData, setTreeData] = useState<TreeNode>(); // State to hold the tree structure data
    const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
    const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
    const [searchInput, setSearchInput] = useState<string>(''); // State for search input

    // Effect to fetch specific material data based on SHA
    useEffect(() => {
        const fetchMaterialData = async () => {
            const { getSpecificMaterialGithub } = await import('@/utils/FetchFromApi');
            const materialData = await getSpecificMaterialGithub(sha[1]); // Fetch specific material
            setUrl(materialData[0].url); // Set the URL from the fetched data
        };
        fetchMaterialData();
    }, [sha]);

    // Effect to fetch content data based on the URL
    useEffect(() => {
        const fetchContentData = async () => {
            if (!url) return; // Exit if URL is not set
            setIsLoading(true); // Start loading
            const { getSpecificContentGithub } = await import('@/utils/FetchFromApi');
            const contentData = await getSpecificContentGithub(url); // Fetch content data
            const decodedContent = atob(contentData?.content); // Decode the base64 content
            setData(decodedContent); // Set the decoded content
            setIsLoading(false); // Stop loading

            // Scroll to the top of the page after fetching content
            if (decodedContent) {
                await window.scrollTo({
                    top: 0,
                    behavior: 'smooth', // Optional: Smooth scrolling effect
                });
            }
        };
        fetchContentData();
    }, [url]);

    // Effect to fetch tree data from GitHub
    useEffect(() => {
        const fetchTreeData = async () => {
            try {
                const { getMaterialsFromGithub, getFileURLRecursively } = await import('@/utils/FetchFromApi');
                const fetchedData: TreeNode | undefined = await getMaterialsFromGithub(sha[1]); // Fetch the data
                if (fetchedData) {
                    setTreeData(fetchedData); // Set the state with the fetched data
                    const fileUrl = (fetchedData.type === 'tree')
                        ? await getFileURLRecursively(`https://api.github.com/repos/copycodecommunity/portfolio/git/trees/${sha[1]}`)
                        : fetchedData.url;

                    if (fileUrl) {
                        setUrl(fileUrl); // Only set the URL if it's a valid string
                    } else {
                        console.log('No valid URL found');
                    }
                }
            } catch (err) {
                console.error('Failed to fetch or process tree data:', err);
            } finally {
                // setIsLoading(false); // Stop loading state
            }
        };

        fetchTreeData(); // Call the fetchTreeData function
    }, [sha]);

    return (
        <div>
            {/* Render the sidebar and content page */}
            <Sidebar
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                setUrl={setUrl}
                navData={treeData}
                isLoading={isLoading}
                setSearchInput={setSearchInput}
                searchInput={searchInput}
                url={url}
            />
            <ContentPage data={data as string} isLoading={isLoading} />
        </div>
    );
};

// Sidebar component to display navigation and search functionality
const Sidebar = ({
    setIsOpen,
    isOpen,
    navData,
    setUrl,
    isLoading,
    setSearchInput,
    searchInput,
    url,
}: {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
    navData?: TreeNode;
    isLoading: boolean;
    url: string;
    searchInput: string;
    setUrl: React.Dispatch<React.SetStateAction<string>>;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const mobileView = useMediaQuery('(max-width:900px)'); // Check if the view is mobile
    const scrollRef = useRef<any>(null); // Reference for scrolling
    const [isVisible, setIsVisible] = useState(true); // State to manage sidebar visibility on scroll
    let lastScrollTop = 0; // Variable to track last scroll position

    // Handle scroll events to show/hide sidebar
    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Show/hide sidebar based on scroll direction
        setIsVisible(scrollTop <= lastScrollTop);
        lastScrollTop = Math.max(scrollTop, 0); // For Mobile or negative scrolling
    };

    // Effect to add/remove scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Effect to scroll to the selected item in the sidebar
    useEffect(() => {
        if (scrollRef.current) {
            const selectedItem: any = Array.from(scrollRef.current.children).find((child: any) => {
                return child.getAttribute('data-url') === url;
            });

            if (selectedItem) {
                selectedItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center', // Center the item in the view
                });
            }
        }
    }, [url]);

    // Function to render tree nodes recursively
    const renderTreeNode = (node: TreeNode): JSX.Element => {
        return (
            <>
                {node?.type === 'tree' ? (
                    // Render folder
                    <strong
                        style={{
                            display: mobileView ? 'none' : 'flex',
                            fontSize: '1.5rem',
                            opacity: 0.8,
                            textTransform: 'capitalize',
                        }}
                    >
                        {node?.path.replace(/^[0-9.]+/, '')}
                    </strong>
                ) : (
                    // Render file
                    <Box
                        data-url={node?.url}
                        onClick={() => setUrl(node?.url)} // Set URL on click
                        sx={{
                            flex: 1,
                            display: 'flex',
                            height: 'auto',
                            textWrap: { xs: 'nowrap', md: 'wrap' },
                            cursor: 'pointer',
                            opacity: node?.url?.includes(url) ? 1 : 0.5,
                            transition: 'all .5s ease-in-out',
                            ':hover': {
                                opacity: 1,
                                transform: 'scale(1.018)',
                            },
                        }}
                    >
                        {node?.path.replace(/^[0-9.]+/, '').replace(/\..+$/, '')} {/* Clean up the file name */}
                    </Box>
                )}
                {node?.children && node?.children.length > 0 && (
                    <>
                        {node?.children.map((childNode) => renderTreeNode(childNode))} {/* Recursively render children */}
                    </>
                )}
            </>
        );
    };

    // Function to filter nodes and maintain the tree structure
    const filterNodes = (node: TreeNode): TreeNode | null => {
        if (!node) return null;

        const filteredChildren = node.children
            ?.map(filterNodes)
            .filter((child): child is TreeNode => child !== null) || [];

        // Return the node if it matches the search input or has filtered children
        if (node.path.toLowerCase().includes(searchInput.toLowerCase()) || filteredChildren.length > 0) {
            return {
                ...node,
                children: filteredChildren,
            };
        }

        return null; // Return null if no match
    };

    const filteredNavData = navData ? filterNodes(navData) : null; // Filter navigation data based on search input

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    display: 'flex',
                    top: { md: 'calc(50px + 24px + 22px)', xs: 'auto' },
                    bottom: { md: 0, xs: isVisible ? 10 : '-50px' },
                    transform: { md: 'scale(1)', xs: isVisible ? 'scale(1)' : 'scale(0)' },
                    width: { xs: 'auto', md: '270px', xl: '270px' },
                    left: { xs: mobileView ? 16 : isOpen ? 10 : '-270px', xl: 16 },
                    zIndex: 10,
                    ...styles.glassphorism(),
                    gap: { md: 2, xs: 0 },
                    p: 2,
                    mb: { md: 2, xs: 0 },
                    pt: { md: 3, xs: 1.7 },
                    pb: { md: 3, xs: 1.7 },
                    transition: 'all .5s ease-in-out',
                    flexDirection: 'column',
                    right: { xs: 16, md: 'auto' },
                    height: { xs: 'auto', md: 'auto' },
                    '::after': {
                        content: '""',
                        position: 'absolute',
                        borderRadius: '16px',
                        background: {
                            xs: 'linear-gradient(90deg, rgba(0,0,0,0.9585084033613446) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 100%)',
                            md: 'transparent',
                        },
                        display: { xs: 'flex', md: 'none' },
                        inset: 0,
                        zIndex: 1,
                        pointerEvents: 'none',
                    },
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        right: -50,
                        top: 10,
                        p: '12px 8px',
                        ...styles.glassphorism(),
                        transition: 'all .5s ease-in-out',
                        cursor: 'pointer',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        display: { xs: mobileView ? 'none' : 'block', md: 'block', xl: 'none' },
                    }}
                    onClick={() => { setIsOpen(prev => !prev); }} // Toggle sidebar visibility
                >
                    <NavigateNext />
                </Box>
                <Box>
                    <input
                        placeholder='Search...'
                        onChange={(e) => setSearchInput(e.target.value)} // Update search input state
                        style={{
                            ...styles.customInput(1, {
                                width: '100%',
                            }),
                            display: mobileView ? 'none' : 'flex',
                        }}
                    />
                </Box>
                <Box
                    ref={scrollRef} // Reference for scrolling
                    sx={{
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: { md: 'column', xs: 'row' },
                        gap: { md: 1.5, xs: 2 },
                        paddingX: { xs: 3, md: 0 },
                        height: { md: 'auto', xs: '24px' },
                    }}
                >
                    {
                        (!filteredNavData && !isLoading) ? <>No post yet!</> : // Display message if no data
                            renderTreeNode(filteredNavData as TreeNode) // Render filtered navigation data
                    }
                </Box>
            </Box>
        </>
    );
};

// ContentPage component to display the main content
const ContentPage = ({ data, isLoading }: { data: string; isLoading: boolean }) => {
    return (
        <>
            {isLoading ? <Loading /> /* Show loading component while loading */ :
                (!data) ? <>No post yet!</> : <Markdown data={{ content: data }} />} {/* Render markdown content */}
        </>
    );
};

export default Page; // Export the main page component
