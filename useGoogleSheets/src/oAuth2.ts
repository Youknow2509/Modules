import 'dotenv/config'
import { google } from 'googleapis';

const CLIENT_ID: string = process.env.SHEETS_CLIENT_ID || '';
const SHEETS_CLIENT_ID: string = process.env.SHEETS_CLIENT_ID || '';
const SHEETS_CLIENT_SECRET: string = process.env.SHEETS_CLIENT_SECRET || '';
const SHEETS_REDIRECT_URL: string = process.env.SHEETS_REDIRECT_URL || '';
const SCOPES: string = process.env.SHEETS_SCOPES || '';

// Create a new OAuth2 client with the configured keys.
const oAuth2Client: any = new google.auth.OAuth2(
    SHEETS_CLIENT_ID, 
    SHEETS_CLIENT_SECRET,
    SHEETS_REDIRECT_URL
);

google.options({auth: oAuth2Client});

// Generate the OAuth2 URL
const authorizeUrl: any = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
});

export { oAuth2Client, authorizeUrl };