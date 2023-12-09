export interface navbar {
    name: string;
    icon: React.ReactNode;
}[]
export interface coreMember {
    name: string;
    role: string;
    image: string
    LinkedIn: string;
    GitHub: string;
    bio: string
    email: string;
};
export interface EventsInterface {
    heading: string,
    description: string,
    headingDate: string,
    calenderDate: string,
    tag: string,
    mode: string,
    participants: number,
    status: string,
    image: string;
    label?: string
};

export interface BlogsInterface {
    heading: string;
    description: string;
    date: string;
    tag: string;
}