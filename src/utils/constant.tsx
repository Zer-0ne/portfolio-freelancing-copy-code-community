import { coreMember, navbar } from "./Interfaces"


// imports icons 
import {
    Book,
    EmojiEvents,
    ForumRounded,
    HomeRounded,
    Person
} from '@mui/icons-material';
import { styles } from "./styles";

export const authMode = [
    {
        name: 'login'
    }, {
        name: 'signup'
    }
]
export const Login = [
    {
        name: 'email',
        required: true,
        type: 'text',
        label: 'Email',
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
        name: 'phone_number',
        required: true,
        type: 'tel',
        // pattern: "[0-9]{10}",
        // errorMessage: "Please enter a valid phone number",
        label: 'Phone Number',
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
        path: `/blog`

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