'use client'
import { Box, Container } from '@mui/material'
import { styles } from '@/utils/styles';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { Data } from '@/utils/Interfaces';

const page = () => {
    const [data, setData] = useState<{
        path: string;
        url: string;
        sha: string;
    }[]>()
    useEffect(() => {
        const fetch = async () => {
            const { getSpecificMaterialGithub } = await import('@/utils/FetchFromApi')
            const Metrials = await getSpecificMaterialGithub('main', 'https://api.github.com/repos/copycodecommunity/portfolio/git/trees/')
            const materialsEntries = Metrials.filter((entry: Data) => entry.type === "tree" && entry.path === "Metrials");
            console.log(materialsEntries[0].url)
            const data = await getSpecificMaterialGithub(materialsEntries[0].sha)
            setData(data)
        }
        fetch()
    }, [])
    return (
        <>
            <Container>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2
                    }}
                >

                    {
                        data?.map((item, index) => (
                            <Cards path={item.path} key={index} sha={item.sha} />
                        ))
                    }
                </Box>
            </Container>
        </>
    )
}

const Cards = ({ path, sha }: { path: string; sha: string }) => {
    return (
        <Link href={`/materials/${path}/${sha}`} style={{ flex: '1 0 200px' }}>
            <Box
                sx={{
                    ...styles.glassphorism(),
                    p: 1,
                    minHeight: 87,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {path}
            </Box>
        </Link>
    );
}

export default page