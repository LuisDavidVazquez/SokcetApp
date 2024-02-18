import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import { connectionDB } from '@/libs/mongodb';
import User from '@/models/user';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { abel: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                await connectionDB();
                console.log(credentials)
                const userFound = await User.findOne({ email: credentials?.email });
                if (!userFound) throw new Error("Usuario no encontrado")
                const passwordMatch = await bcrypt.compare(credentials!.password,
                    userFound.password)

                if (!passwordMatch) throw new Error("La contraseña no coincide")
                return userFound
            },
        })
    ],
    callbacks: {
        jwt({ account, token, user, profile, session }) {
            if (user) token.user = user;
            return token;
        },
        session({ session, token }) {
            session.user = token.user as any;
            return session;
        },
    },
    pages: {
        signIn: "/"
    }
})

export { handler as GET, handler as POST };