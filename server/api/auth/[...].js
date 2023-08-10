
// file: ~/server/api/auth/[...].ts
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
    // A secret string you define, to ensure correct encryption
    secret: process.env.PRODUCTION == 'true'
        ? process.env.KG_API_KEY
        : process.env.KG_DEV_API_KEY,

    callbacks: {
        // Callback when the JWT is created / updated, see https://next-auth.js.org/configuration/callbacks#jwt-callback
        jwt: async ({ token, user, account }) => {
            const isSignIn = user ? true : false;
            if (isSignIn) {
                token.jwt = account.access_token
                token.provider = account.provider
            }
            return Promise.resolve(token)
        },
        // Callback whenever session is checked, see https://next-auth.js.org/configuration/callbacks#session-callback
        session: async ({ session, token }) => {
            session.provider = token.provider
            session.token = token.jwt
            return Promise.resolve(session)
        },
    },

    providers: [

        GithubProvider.default({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),

        GoogleProvider.default({
            authorization: "https://accounts.google.com/o/oauth2/auth",
            userInfo: "https://www.googleapis.com/oauth2/v3/userinfo",
            token: "https://oauth2.googleapis.com/token",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),

        // Cilogon
        {
            id: 'cilogon',
            name: 'CILogon',
            type: 'oauth',
            version: '2.0',
            authorization: 'https://cilogon.org/authorize/',
            token: 'https://cilogon.org/oauth2/token',
            userinfo: 'https://cilogon.org/oauth2/userinfo',
            profile: (profile) => {
                return {
                    id: profile.iss + profile.sub,
                    name: profile.name,
                    email: profile.email,
                    affiliation: profile.affiliation
                }
            }
        },

        process.env.TESTING === 'true'
            ? CredentialsProvider.default({
                name: 'Credentials',
                credentials: {
                    username: { label: 'Username', type: 'text', placeholder: '(hint: jsmith)' },
                    password: { label: 'Password', type: 'password', placeholder: '(hint: hunter2)' }
                },
                authorize(credentials) {
                    const user = { 
                        userid: 53, 
                        username: 'jsmith',
                        email: 'jsmith@gamil.com',
                        name: 'John Smith',
                        password: 'hunter2',
                        is_admin: true,
                        can_admin: true,
                    }
                    if (credentials?.username === user.username 
                        && credentials?.password === user.password) {
                        return user
                    } else {
                        console.error('Warning: Malicious login attempt registered, bad credentials provided')
                        return null
                    }
                }
            })
            : undefined,
    ]
})