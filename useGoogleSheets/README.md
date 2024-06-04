# Contact:
- **Mail**: *lytranvinh.work@gmail.com*
- **Github**: *https://github.com/Youknow2509*

# Attention: 
- Add `Authorized redirect URIs` in `https://console.cloud.google.com/apis/credentials/oauthclient`
    + For example: 
      + `http://localhost:3300`
      + `http://localhost:3300/oauth2callback`
      + `https://oauth.pstmn.io/v1/browser-callback`
      + `https://oauth.pstmn.io/v1/callback`
- Scope:
  + Use API V3: 
    + `https://spreadsheets.google.com/feeds`
  + Use API V4:
    + `https://www.googleapis.com/auth/spreadsheets.readonly`
    + `https://www.googleapis.com/auth/spreadsheets`
    + `https://www.googleapis.com/auth/drive.readonly`
    + `https://www.googleapis.com/auth/drive`



# Creat token Credentials google API
```ts
// IMPORT ...

// Change input 
const PORT: number = YOUR_PORT;
const SHEETS_CLIENT_ID: string = YOUR_SHEETS_CLIENT_ID
const SHEETS_CLIENT_SECRET: string = YOUR_SHEETS_CLIENT_SECRET
const SHEETS_REDIRECT_URL: string = YOUR_SHEETS_REDIRECT_URL
const SCOPES: string = YOUR_SCOPES;

// Use express creat sever
const sever: express.Express = express();

// Create a new OAuth2 client with the configured keys.
const oAuth2Client: any = new google.auth.OAuth2(
    SHEETS_CLIENT_ID, 
    SHEETS_CLIENT_SECRET,
    SHEETS_REDIRECT_URL // Authorized redirect in google console
);

google.options({auth: oAuth2Client});

// Generate the OAuth2 URL
const authorizeUrl: any = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
});

sever.get('/',  async (req: Request, res: Response) => {
    res.redirect(authorizeUrl); // Authorized redirect in google console
});

sever.listen(PORT, () => {
    console.log(`Server listening on: http://localhost:${PORT}`);
});

const createToken = async () => {
    
    const code: string = await new Promise((resolve) => {
        // After logging in, it will return to the path '/oauth2callback' and return the data
        sever.get('/oauth2callback', (req: Request, res: Response) => {
            const code: string = req.query.code as string;
            res.send('Authentication successful! Please return to the console.');
            resolve(code);
        });
    });

    const { tokens } = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(tokens);
    
    console.log('Token created successfully: ' + tokens);
};

createToken();
```
# Use google OAUTH2
# Connect api google sheets same database
# Hande database with it


