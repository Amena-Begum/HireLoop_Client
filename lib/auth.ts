
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUrl = process.env.BETTER_AUTH_DB_URL;

if (!mongoUrl) {
  throw new Error("BETTER_AUTH_DB_URL is missing.");
}

const client = new MongoClient(mongoUrl);

const db = client.db("hireloopdb");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "job-seeker",
        input: true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
      requireEmailVerification: true,
  },
  emailVerification: {
  sendOnSignUp: true,
  sendOnSignIn: true,
  autoSignInAfterVerification: true,
  expiresIn: 3600,

  sendVerificationEmail: async ({ user, url }) => {
    // Resend দিয়ে verification email পাঠানো হবে
  },
},
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
