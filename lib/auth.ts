import { supabase } from "./supabase";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) return null;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    });

    if (error || !data.user) {
        console.error("Supabase Auth Error:", error?.message);
        return null;
    }

    return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || '',
        image: data.user.user_metadata?.avatar_url || '',
    };
}
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    }
};
