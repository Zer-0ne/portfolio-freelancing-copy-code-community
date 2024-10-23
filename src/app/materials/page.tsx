'use client'
import { Box, Container } from '@mui/material'
import { styles } from '@/utils/styles';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { Data } from '@/utils/Interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaterialTree, fetchTopLevelMaterials } from '@/slices/materialSlice';

const page = () => {
    const [data, setData] = useState<{
        path: string;
        url: string;
        sha: string;
    }[]>()

    /**
     * ***************************************************************************************************************************************
     * TODO: need to store the materials in Redux here so that there are no excessive requests or API limits exceeded. I will do this later. *
     *                                                                                                                                       *
     * ***************************************************************************************************************************************
        const dispatch = useDispatch();
        const { materials, currentTree, loading, error } = useSelector((state) => state.materials);
        useEffect(() => {
            dispatch(fetchTopLevelMaterials());
        }, [dispatch]);
        const handleMaterialClick = (material) => {
            dispatch(fetchMaterialTree(material.sha));
        };
        console.log(materials)
     */


    useEffect(() => {
        const fetch = async () => {
            const { getSpecificMaterialGithub, } = await import('@/utils/FetchFromApi')
            const Metrials = await getSpecificMaterialGithub('main', 'https://api.github.com/repos/copycodecommunity/portfolio/git/trees/')
            const materialsEntries = Metrials.filter((entry: Data) => entry.type === "tree" && entry.path === "Metrials");
            const data = await getSpecificMaterialGithub(materialsEntries[0].sha)
            setData(data)
            // const sha = await getLatestSha('copycodecommunity', 'portfolio')
            // console.log(await getMaterialsFromGithub(sha));
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
                        gap: 2,
                        mb: 2
                    }}
                >

                    {
                        data?.map((item, index) => (
                            <Cards path={item.path} key={index} sha={item.sha} />
                        ))
                    }
                    {/* <ul>
                        {materials[0]?.children?.map((material) => (
                            <li key={material.sha} onClick={() => handleMaterialClick(material)}>
                                {material.path}
                            </li>
                        ))}
                    </ul> */}
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
                    justifyContent: 'center',
                    transition: 'all .2s ease-in-out',
                    position: 'relative',
                    zIndex: 1,
                    textTransform: 'capitalize',
                    ':hover': {
                        border: '1px solid rgba(255, 255, 255, 1)'
                    },
                }}
            >
                {path}
            </Box>
        </Link >
    );
}

export default page