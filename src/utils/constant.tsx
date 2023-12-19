import { BlogsInterface, Data, EventsInterface, Item, coreMember, navbar } from "./Interfaces"


// imports icons 
import {
    Book,
    CodeRounded,
    EmojiEvents,
    FormatBoldRounded,
    FormatItalic,
    FormatListBulletedRounded,
    FormatListNumberedRounded,
    FormatQuoteRounded,
    ForumRounded,
    HomeRounded,
    ImageRounded,
    LinkRounded,
    Person
} from '@mui/icons-material';
import { styles } from "./styles";
import { Typography } from "@mui/material";

export const authMode = [
    {
        name: 'login'
    }, {
        name: 'signup'
    }
]
export const Login = [
    {
        name: 'username',
        required: true,
        type: 'text',
        label: 'Username',
    },
    {
        name: 'password',
        required: true,
        label: 'password',
        type: 'password'
    }
]
export const signup = [
    {
        name: 'name',
        required: true,
        type: 'text',
        label: 'Name'
    },
    {
        name: 'email',
        required: true,
        type: 'text',
        label: 'Email'
    },
    {
        name: 'username',
        required: true,
        // type: 'tel',
        // pattern: "[0-9]{10}",
        // errorMessage: "Please enter a valid phone number",
        label: 'Username',
    },
    {
        name: 'password',
        required: true,
        type: 'password',
        label: 'Password'

    },
    {
        name: 'confirmpassword',
        required: true,
        type: 'password',
        label: 'Confirm Password'
    }
]

export const navbarContent = [
    {
        name: 'home',
        icon: <HomeRounded
            sx={styles.iconStyle()}
        />,
        path: '/'
    },
    {
        name: 'about',
        icon: <Person
            sx={styles.iconStyle()}
        />,
        path: `/about`
    },
    {
        name: 'blog',
        icon: <Book
            sx={styles.iconStyle()}
        />,
        path: `/blogs`

    },
    {
        name: 'events',
        icon: <EmojiEvents
            sx={styles.iconStyle()}
        />,
        path: `/events`
    },
    {
        name: 'contact',
        icon: <ForumRounded
            sx={styles.iconStyle()}
        />,
        path: `/contact`
    }
]

export const createBlog = [
    {
        type: 'text',
        name: 'title',
        placeholder: 'Title',
        required: true,
        size: '2 0 30%'
    },
    {
        name: 'description',
        type: 'text',
        placeholder: 'Description',
        required: true,
        size: '1 0 30%'
    },
    {
        name: 'tag',
        placeholder: 'Tags',
        type: 'text',
        required: false,
        size: '1 0 30%'
    },

]

export const createEvent = [
    ...createBlog,
    {
        name: 'mode',
        type: 'text',
        placeholder: 'Mode of Event',

        required: true,
        size: 1
    },
    {
        name: 'participants',
        type: 'number',
        placeholder: 'participants',
        required: true,
        size: 1
    },
    {
        name: 'status',
        placeholder: 'Status',
        type: 'text',
        required: true,
        size: 1
    },
    {
        name: 'image',
        placeholder: 'Thumbnail',
        type: 'file',
        required: true,
        size: 10
    },
    {
        name: 'label',
        placeholder: 'Label',
        type: 'text',
        required: false,
        size: 1
    },
    {
        name: 'date',
        type: 'date',
        placeholder: "Select a date",
        required: true,
        size: '1 0 150px'
    }

]

export const wordEditorFunc = [
    {
        icon: (type?: boolean, item?: Item) => (<FormatBoldRounded
            sx={styles.wordEditorIcon()}
        />),
        name: 'bold',
        toMoveCursor: -3,
        code: () => { return ' **** ' },
        type: (isTrue: boolean = false) => isTrue
    },
    {
        icon: (type?: boolean, item?: Item) => (<FormatItalic
            sx={styles.wordEditorIcon()}
        />),
        name: 'italic',
        toMoveCursor: -2,
        code: () => { return ' ** ' },
        type: (isTrue: boolean = false) => isTrue
    },
    {
        icon: (type?: boolean, item?: Item) => (<FormatListNumberedRounded
            sx={styles.wordEditorIcon(26, {}, type, item)}
        />),
        name: 'ol',
        code: (number: number = 1) => { return `${number}. ` },
        type: (isTrue: boolean = false) => isTrue
    },
    {
        icon: (type?: boolean, item?: Item) => (<FormatListBulletedRounded
            sx={styles.wordEditorIcon(26, {}, type, item)}
        />),
        name: 'ul',
        code: () => { return ` * ` },
        type: (isTrue: boolean = false) => isTrue
    },
    {
        name: 'image',
        icon: (type?: boolean, item?: Item) => (<ImageRounded sx={styles.wordEditorIcon()} />),
        toMoveCursor: -2,
        code: (image?: string) => { return `\n![]('${image as string}') ` },
        type: (isTrue: boolean = false) => isTrue
    },
    {
        name: 'code',
        icon: (type?: boolean, item?: Item) => <CodeRounded sx={styles.wordEditorIcon()} />,
        toMoveCursor: -5,
        code: () => (' ```\n\n``` '),
        type: (isTrue: boolean = false) => isTrue
    },
    {
        name: 'link',
        icon: (type?: boolean, item?: Item) => <LinkRounded sx={styles.wordEditorIcon()} />,
        toMoveCursor: -2,
        code: () => { return ` []() ` },
        type: (isTrue: boolean = false) => isTrue
    },
    {
        name: 'qoutes',
        icon: (type?: boolean, item?: Item) => <FormatQuoteRounded sx={styles.wordEditorIcon(28, {}, type, item)} />,
        code: () => { return `> ` },
        type: (isTrue: boolean = false) => isTrue
    },
    {
        name: 'h1',
        icon: (type?: boolean, item?: Item) => <Typography variant='caption' sx={styles.wordEditorIcon(15, {
            fontWeight: '700'
        })}>H1</Typography>,
        code: () => { return `# ` },
        type: (isTrue: boolean = false) => isTrue
    },
    {
        name: 'h2',
        icon: (type?: boolean, item?: Item) => <Typography variant='caption' sx={styles.wordEditorIcon(15, {
            fontWeight: '700'
        })}>H2</Typography>,
        code: () => { return `## ` },
        type: (isTrue: boolean = false) => isTrue
    },
    {
        name: 'h3',
        icon: (type?: boolean, item?: Item) => <Typography variant='caption' sx={styles.wordEditorIcon(15, {
            fontWeight: '700'
        })}>H3</Typography>,
        code: () => { return `### ` },
        type: (isTrue: boolean = false) => isTrue
    },
    {
        name: 'h4',
        icon: (type?: boolean, item?: Item) => <Typography variant='caption' sx={styles.wordEditorIcon(15, {
            fontWeight: '700'
        })}>H4</Typography>,
        code: () => { return `#### ` },
        type: (isTrue: boolean = false) => isTrue
    },
    {
        name: 'h5',
        icon: (type?: boolean, item?: Item) => <Typography variant='caption' sx={styles.wordEditorIcon(15, {
            fontWeight: '700'
        })}>H5</Typography>,
        code: () => { return `##### ` },
        type: (isTrue: boolean = false) => isTrue
    },
    {
        name: 'h6',
        icon: (type?: boolean, item?: Item) => <Typography variant='caption' sx={styles.wordEditorIcon(15, {
            fontWeight: '700'
        })}>H6</Typography>,
        code: () => { return `###### ` },
        type: (isTrue: boolean = false) => isTrue
    },
]

export const aboutCCC = [
    {
        heading: 'Copy Code Community!',
        content: `Copy Code Community is like a cool online club for people who love playing with computers and making websites and apps. Whether you're a total pro or just starting, everyone is invited to share their computer codes and chat about tech stuff.
        <br />
        It's a friendly space where we help each other learn and grow. We really like sharing our codes so that everyone can learn from them. You might be into building websites or trying out new tech things - whatever it is, you'll find friends here who are excited to talk about it.
        <br />
        We're not just about serious coding - we like to have fun too! We share funny computer jokes, take part in friendly coding challenges, and talk about the latest tech news. It's a mix of learning and laughing.
        <br />
        And guess what? Everyone is welcome! It doesn't matter if you know a lot about coding or just a little; we're here to help each other out. We also chat about interesting tech trends and other fun stuff because, hey, we're not just about computers - we're people with lots of interests!
        <br />
        So, if you want to join a friendly group of tech fans, learn new things, and have a good time, Copy Code Community is the place for you. Come on in and be part of our coding family!`
    },
    {
        heading: 'Why Copy Code Community?',
        content: `Copy Code Community exists for one simple reason - to bring together people who share a love for coding, web development, and all things tech. We believe in the power of collaboration and learning from one another. Whether you're a seasoned developer or someone taking their first steps into the coding world, this community is a space where you can connect with like-minded individuals, share your knowledge, and grow together.

        At Copy Code Community, we emphasize the beauty of open-source collaboration. The idea is to openly share code so that everyone can benefit, learn, and contribute. Whether you're into creating websites, crafting software, or exploring the exciting realm of web3 technologies, our community provides a welcoming platform for discussions, collaborations, and the exploration of the ever-evolving digital landscape.
        
        Diversity and inclusivity are at the core of our community values. We embrace individuals from all backgrounds and skill levels. It's not just about the code; it's about the people behind it. We encourage open discussions on the latest tech trends, industry insights, and even non-tech topics. Our goal is to create an environment where everyone feels comfortable asking questions, sharing their experiences, and learning from each other.
        
        Copy Code Community is not just about serious coding business - it's also about having fun while we code. Whether it's sharing coding memes, participating in friendly challenges, or discussing the latest tech news, we believe in balancing work and play.
        
        Education is another key focus. We host workshops, webinars, and learning sessions to help our members enhance their skills and explore new technologies. If you're stuck on a problem or seeking guidance, you can count on the community to provide support. We understand that one of the best ways to learn is by teaching, and our community fosters an environment of mutual support and knowledge exchange.
        
        In essence, Copy Code Community is your digital home for all things tech. It's a place where you can connect, learn, and grow alongside a friendly group of individuals who share your passion for coding and technology. Whether you're here to seek advice, share your experiences, or just enjoy the company of fellow tech enthusiasts, we're excited to have you as part of our coding family!`
    },

]

export const coreTeamMember: coreMember[] = [
    {
        name: 'Sahil khan',
        role: 'Co-founder & Tech lead',
        image: 'https://www.osmpic.com/wp-content/uploads/2019/08/Cat-image-for-WhatsApp-dp-min.jpg',
        LinkedIn: '',
        GitHub: 'https://github.com/sahilk1234567890',
        bio: `I am a 2nd year student at the University of Maryland, College Park majoring in Computer Science and minoring in Mathematics`,
        email: 'sahilk@copycodecommunity.org',
    },
    {
        name: 'Ziya-ul Rehman',
        role: 'Co-Founder',
        image: 'https://ih1.redbubble.net/image.487729662.1469/throwpillow,small,1000x-bg,f8f8f8-c,0,200,1000,1000.u2.jpg',
        LinkedIn: '',
        GitHub: 'https://github.com/sahilk1234567890',
        bio: `I am a 2nd year student at the University of Maryland, College Park majoring in Computer Science and minoring in Mathematics`,
        email: 'sahilk@copycodecommunity.org',
    },
    {
        name: 'Ibrahim Khursheed',
        role: 'Content Writer',
        image: 'https://wallpaperaccess.com/full/2133155.jpg',
        LinkedIn: '',
        GitHub: 'https://github.com/sahilk1234567890',
        bio: `I am a 2nd year student at the University of Maryland, College Park majoring in Computer Science and minoring in Mathematics`,
        email: 'sahilk@copycodecommunity.org',
    },
    {
        name: 'Musab Hussain',
        role: 'Management lead',
        image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp7380751.jpg&f=1&nofb=1&ipt=92d8bdbdccdc6fb6cfa1759c8e58d34ce5b612b82aff3b022b073885a6730b4c&ipo=images',
        LinkedIn: '',
        GitHub: 'https://github.com/sahilk1234567890',
        bio: `I am a 2nd year student at the University of Maryland, College Park majoring in Computer Science and minoring in Mathematics`,
        email: 'sahilk@copycodecommunity.org',
    },
    {
        name: 'Ayan',
        role: 'Mentor',
        image: 'https://www.osmpic.com/wp-content/uploads/2019/03/PicsArt_03-24-02.06.31-903x1024.jpg',
        LinkedIn: '',
        GitHub: 'https://github.com/sahilk1234567890',
        bio: `I am a 2nd year student at the University of Maryland, College Park majoring in Computer Science and minoring in Mathematics`,
        email: 'sahilk@copycodecommunity.org',
    },

]

// export const blogsDetails: BlogsInterface[] = [
//     {
//         title: 'React Native CheetSheet',
//         description: 'React Native CheetSheet is a library that allows you to create a cheatsheet for your React Native app. It is a simple and easy-to-use',
//         updatedAt: '20 jan 2020',
//         tag: 'react_native'
//     },
//     {
//         title: 'React CheetSheet',
//         description: 'React CheetSheet is a library that allows you to create a cheatsheet for your React app. It is a simple and easy-to-use',
//         updatedAt: '20 jun 2021',
//         tag: 'react.js'
//     },
//     {
//         title: 'Node CheetSheet',
//         description: 'Node CheetSheet is a library that allows you to create a cheatsheet for your Node app. It is a simple and easy-to-use',
//         updatedAt: '31 dec 2020',
//         tag: 'node.js'
//     },
//     {
//         title: 'Next CheetSheet',
//         description: 'Next CheetSheet is a library that allows you to create a cheatsheet for your Next app. It is a simple and easy-to-use',
//         updatedAt: '10 oct 2024',
//         tag: 'next.js'
//     },
// ]

export const eventsDetails: EventsInterface[] = [
    {
        title: 'React Native Workshop',
        description: 'This is the tamplate description of React native workshop',
        headingDate: '10 Jan 2023',
        calenderDate: 'Oct 24, 2023',
        tag: 'React_native',
        mode: 'Online',
        participants: 146,
        status: 'End',
        image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.filepicker.io%2Fapi%2Ffile%2F4C6yPDywSUeWYLyg1h9G&f=1&nofb=1&ipt=be055fef91c6c9eb73b7c305ad18a9e55e560b114fa34d2519ce26a985bedee7&ipo=images',
        label: 'Featured'
    },
    {
        title: 'React Workshop',
        description: 'This is the tamplate description of React workshop',
        headingDate: '10 June 2023',
        calenderDate: 'Dec 24, 2023',
        tag: 'React',
        mode: 'Offline',
        participants: 155,
        status: 'End',
        image: 'https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/002/610/587/datas/medium_square.png',
        label: 'UpComming'
    },
    {
        title: 'Node Workshop',
        description: 'This is the tamplate description of Node workshop',
        headingDate: '10 July 2023',
        calenderDate: 'Nov 24, 2023',
        tag: 'Node.js',
        mode: 'Offline',
        participants: 200,
        status: 'End',
        image: 'https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/002/610/587/datas/medium_square.png'
    },
    {
        title: 'Next Workshop',
        description: 'This is the tamplate description of Next workshop',
        headingDate: '10 Nov 2024',
        calenderDate: 'Dec 31, 2024',
        tag: 'Next.js',
        mode: 'Hybrid',
        participants: 500,
        status: 'Upcoming',
        image: 'https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/002/610/587/datas/medium_square.png',
        label: 'Featured'
    },
]