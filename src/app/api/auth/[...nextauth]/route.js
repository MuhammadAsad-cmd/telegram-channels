import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

let cachedAuthOptions = null;

async function getAuthOptions() {
  if (cachedAuthOptions) return cachedAuthOptions;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  let clientId = process.env.GOOGLE_CLIENT_ID;
  let clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  try {
    const res = await fetch(`${apiUrl}/user/google-config`);
    const json = await res.json();
    if (json?.result && json?.data?.clientId && json?.data?.clientSecret) {
      clientId = json.data.clientId;
      clientSecret = json.data.clientSecret;
    }
  } catch {
    // Use env vars if API fails or returns invalid data
  }

  cachedAuthOptions = {
    providers: [
      GoogleProvider({
        clientId: clientId ?? "",
        clientSecret: clientSecret ?? "",
      }),
    ],
    callbacks: {
      async jwt({ token, account, profile }) {
        if (account?.provider === "google" && profile) {
          const res = await fetch(`${apiUrl}/user/social`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sub: profile.sub,
              type: "google",
              name: profile.name,
              email: profile.email,
              image: profile.picture,
            }),
          });
          const data = await res.json();
          console.log("[NextAuth] /user/social response:", JSON.stringify(data));
          if (data?.token && data?.data) {
            token.backendToken = data.token;
            token.backendUser = data.data;
            token.backendError = undefined;
          } else {
            token.backendError = data?.message || "Sign-in with Google failed. Please try again or use email and password.";
          }
        }
        return token;
      },
      async session({ session, token }) {
        if (token.backendToken) session.backendToken = token.backendToken;
        if (token.backendUser) session.backendUser = token.backendUser;
        if (token.backendError) session.backendError = token.backendError;
        return session;
      },
    },
  };

  return cachedAuthOptions;
}

export async function GET(req, context) {
  const options = await getAuthOptions();
  return NextAuth(options)(req, context);
}

export async function POST(req, context) {
  const options = await getAuthOptions();
  return NextAuth(options)(req, context);
}
