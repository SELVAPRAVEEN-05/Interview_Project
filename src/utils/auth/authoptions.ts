import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// types imports
import type { NextAuthConfig } from "next-auth";

// import { JWT } from "next-auth/jwt";

import GoogleProvider from "next-auth/providers/google";

import { JWT } from "next-auth/jwt";
import { postRequest } from "../axios/axios";
const authOptions = {
  providers: [ GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorization:{
            url: `https://accounts.google.com/o/oauth2/auth/authorize?response_type=code&prompt=login`
            },
            
  }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      authorize: async (credentials) => {
        try {
        
        let data:any=await postRequest("/api/auth/credential",{email:credentials.username,password:credentials.password})
        let user=data.data;
        user=data.data
          user.id=user.user.id
          user.logo = user.user.logo;
        user.name = user.user.name;
        user.email = user.user.email;
          return user ?user : null;
        } catch (error) {
          console.error("Error during authentication", error);
          return null;
        }
      },
    }),
   
  ],
  callbacks: {
 async signIn({ user, account, profile }:any) {
  if (account?.provider === "google") {
    try {
      
      const data:any = await postRequest("/api/auth/fetchUserDetails", { email: user.email });
      // console.log("Data ",data);
      // This is where the issue is. Your API returns user data nested in data.data.user
      // But you're not accessing the right structure when assigning properties
      // Fix: Access correct structure and assign properly
      if (data.data && data.data.user){
        user.id = data.data.user.id;
        user.logo = data.data.user.logo;
        user.name = data.data.user.name;
        user.email = data.data.user.email;
        user.role=data.data.user.role;
        user.token = data.data.token; // Make sure the token is assigned to the user object
       
      }
      
      return true;
    } catch (error) {
      console.error("Error during Google sign in:", error);
      return false;
    }
  }
  // console.log("user", user);
  return true;
},
  async jwt({ token, user }:any) {
  if (user) {
    // console.log("User in JWT callback:", user);
    
    token.id = user.id;
    token.logo = user.logo;
    token.name = user.name;
    token.email = user.email;
    token.user=user.role
    
    // Make sure to grab the token from the user object
    token.token = user.token; 
    
    // console.log("Token after JWT callback:", token);
  }
  return token;
}
,
    
 async session({ session, token }: { session: any; token: JWT }) {
  // console.log("Token in session callback:", token);

  session.user = {
    id: token.id,
    logo: token.logo,  // Ensure logo is properly assigned
    name: token.name,
    email: token.email || "",
    role:token.user,
    token: token.token, // Ensure access token is correctly mapped
  };

  // console.log("Session after session callback:", session);

  return session;
}

  },

  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);