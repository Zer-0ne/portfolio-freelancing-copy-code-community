import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Session } from '@/utils/Interfaces';

export const metadata: Metadata = {
    title: 'Create Forms: Copy Code Community',
    description: `Copy Code Community is like a cool online club for people who love playing with computers and making websites and apps. Whether you're a total pro or just starting, everyone is invited to share their computer codes and chat about tech stuff.`,
    authors: [
        {
            name: 'Copy Code Community',
            url: 'https://copycode.vercel.app'
        },
        {
            name: 'Jamia Hamdard',
            url: 'https://jamiahamdard.edu'
        }
    ],
    keywords: `Code, Programming, Web Development, Software Engineering,Copy Code Community,Copy Code Community Official, Computer Science, Developer, JamiaHamdard, Copy Code, Open Source, Jamia hamdard, Students community, Tutorial, java, python, c,c++, react,next,node,full stack, hackthon,Code, Programming, Web Development, Software Engineering,Copy Code Community, Computer Science, Developer, JamiaHamdard, Copy Code, Open Source, Jamia hamdard, Students community, Tutorial, java, python, c,c++, react,next,node,full stack, hackthon,Jamia Hamdard College, Technical Students Community, Jamia Hamdard Students, College Technology Forum, Student Tech Hub, Technical Discussions, Student Projects, Coding Community, Technology Events, Engineering Students, Computer Science Club, Tech Enthusiasts, Programming Challenges, Campus Tech News,Jamia Hamdard, Technical College, Student Technology Network, Coding Community, STEM Education, Programming Languages, Innovation Hub, IT Projects, Tech Workshops, Student Tech Blog, Digital Learning, Computer Science Society, Campus Tech Events, Engineering Projects, IT Networking, Hackathons, Software Development, Open Source Contributions, Tech Meetups, College Tech News,Copy Code Community Official,Copy Code Community Official`,
    robots: 'follow, index',
    publisher: 'Copy Code Community',
};

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Dynamically import the utilities only when needed
    const { currentSession } = await import('@/utils/Session');
    const { userInfo } = await import('@/utils/FetchFromApi');

    // Fetch the current session on the server side
    const session = await currentSession() as Session | null;

    // If no session exists, render a 404 page
    if (!session) {
        return notFound();
    }

    // Fetch user information based on the current session
    const currUser = await userInfo(session?.user?.username);

    // Check if the user is allowed to access this page
    const isAdmin = ['user', 'moderator'].includes(currUser?.role) ? false : true;

    if (!isAdmin) {
        return notFound(); // Redirect or 404 if the user is not an admin
    }

    return (
        <div>
            {children}
        </div>
    );
}