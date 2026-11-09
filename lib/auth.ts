import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { Resend } from "resend";

const mongoUrl = process.env.BETTER_AUTH_DB_URL;

if (!mongoUrl) {
  throw new Error("BETTER_AUTH_DB_URL is missing.");
}

const client = new MongoClient(mongoUrl);

const db = client.db("hireloopdb");

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error(
      "RESEND_API_KEY is missing — verification emails cannot be sent."
    );
    return null;
  }

  return new Resend(apiKey);
};

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
      const resend = getResend();

      if (!resend) {
        console.log(
          `Verification link for ${user.email} (not sent): ${url}`
        );
        return;
      }

      const { error } = await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ?? "HireLoop <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your HireLoop account",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0b0b0b;color:#f5f5f5;border-radius:12px;">
            <h1 style="font-size:20px;margin:0 0 12px;">Verify your email</h1>
            <p style="font-size:14px;line-height:1.6;color:#a1a1aa;margin:0 0 24px;">
              Welcome to HireLoop! Click the button below to verify your email address.
              The link expires in 1 hour.
            </p>
            <a href="${url}" style="display:inline-block;padding:12px 24px;background:#5b4cf5;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
              Verify Email
            </a>
            <p style="font-size:12px;color:#71717a;margin:24px 0 0;">
              If you didn't create a HireLoop account, you can safely ignore this email.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("Failed to send verification email:", error);
      }
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
