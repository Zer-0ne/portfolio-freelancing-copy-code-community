
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { NextAuthOptions } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import Users from "@/Models/Users";
import connect from "./database";
export const AuthOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    providers: [
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET
        // }),
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
        async jwt({ token, user }) {
            // Access the user information stored in the token
            // console.log(user);

            if (user) {
                // Update the token with the user information
                token.id = user.id;
            }

            return token;
        },
        async session({ session, token }) {
            session.user = session.user ?? {};
            (session.user as any).id = token?.id;
            return session;
        },
    },
};