
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { Account, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from 'next-auth/providers/github'
import LinkedinProvider from 'next-auth/providers/linkedin'
import Users from "@/Models/Users";
import connect from "./database";
import { createUser } from "./FetchFromApi";
import { Data } from "./Interfaces";
export const AuthOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
        LinkedinProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID as string,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'username', type: 'string' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                try {
                    const { username, password } = credentials as {
                        username: string;
                        password: string
                    };
                
                    if(!password || !username) return 'Please Provide the Credentials';
                
                    // Find user by email
                    await connect()
                    const user = await Users.findOne<any>({ username });

                    if (!user) {

                        return Promise.resolve(null)
                    }

                    // Compare passwords
                    const isPasswordValid = await bcrypt.compare(password, user.password);
                    if (!isPasswordValid) {

                        return Promise.resolve(null)
                    }

                    // Add user information to the token
                    return user;
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        return Promise.resolve(null)
                    }
                    return Promise.resolve(null)
                }
            },
        }),
    ],
    jwt: {
        // encryption: true,
        secret: process.env.JWT_SECRET,
    },
    callbacks: {
        async signIn({ user, account }: { user: any, account: Account | null; }) {
            try {
                if (['google', 'github', 'linkedin'].includes(account?.provider as string)) {
                    await connect()
                    const username = await user.id
                    const isExist = await Users.findOne<any>({ username });
                    user.username = username;
                    user.role = isExist?.role;
                    

                    if (isExist) return user
                    await createUser({
                        username: user?.id as string,
                        name: user?.name as string,
                        image: user?.image as string,
                        email: user?.email as string,
                    } as Data)
                    return user
                }
                return user
            } catch (error) {
                console.log(error)
                return false
            }
        },
        async jwt({ token, user }) {
            // Access the user information stored in the token
            // console.log(user);

            if (user) {
                // Update the token with the user information
                token.id = user.id;
                token.username = (user as any).username
                token.role = (user as any).role
            }

            return token;
        },
        async session({ session, token }) {
            session.user = session.user ?? {};
            (session.user as any).id = token?.id;
            (session.user as any).username = token?.username;
            (session.user as any).role = token?.role;
            return session;
        },
    },
};