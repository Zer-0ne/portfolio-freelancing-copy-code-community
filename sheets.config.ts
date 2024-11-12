import { BaseExternalAccountClient, GoogleAuth, OAuth2Client } from "google-auth-library";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth";
import { google } from "googleapis";

export const auth = async (): Promise<string | BaseExternalAccountClient | GoogleAuth<JSONClient> | OAuth2Client | undefined> => {
    try {
        const client = await google.auth.getClient({
            credentials: {
                type: "service_account",
                private_key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                client_id: process.env.GOOGLE_SHEET_CLIENT_ID,
                token_url: "https://oauth2.googleapis.com/token",
                universe_domain: "googleapis.com",
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
        });
        return client;
    } catch (error) {
        console.error("Error creating Google Sheets API client:", error);
        throw error; // Rethrow the error after logging it
    }
};
