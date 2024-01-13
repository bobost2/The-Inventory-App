import { returnUserByLogin } from "@/app/utils/mongoManager";
import NextAuth, { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
var bcrypt = require('bcryptjs')

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials) 
            {
                const { username, password } = credentials as { username: string, password: string };
                try 
                {
                    const dbRes = await returnUserByLogin(username);
                    const res = await bcrypt.compare(password, dbRes.hashedPassword);

                    if (res === true) 
                    {
                        const user:User = { name: username, id: dbRes._id.toString() };
                        return user;
                    }
                    else
                    {
                        return null;
                    }
                } 
                catch (error) 
                {
                  console.log("Error: ", error);
                  return null;
                }
            },
        }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/",
  },
});

export { handler as GET, handler as POST }
