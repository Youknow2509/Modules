# Contact:
- **Mail**: *lytranvinh.work@gmail.com*
- **Github**: *https://github.com/Youknow2509*

# Data base with gooele sheets
- [Contact:](#contact)
- [Data base with gooele sheets](#data-base-with-gooele-sheets)
- [Attention:](#attention)
- [Creat token Credentials google API](#creat-token-credentials-google-api)
- [Hande database with it](#hande-database-with-it)
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

const createToken = async () => {

    sever.get('/',  async (req: Request, res: Response) => {
        res.redirect(authorizeUrl); // Authorized redirect in google console
    });

    sever.listen(PORT, () => {
        console.log(`Server listening on: http://localhost:${PORT}`);
    });
    
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
    return tokens;
};

createToken()
    .catch((error) => {
        console.log('Error: ', error);
    });;
```
# Hande database with it

- *Get data*:
  - In **CLI**: 
```shell
  curl --location --globoff 'https://sheets.googleapis.com/v4/spreadsheets/{YOUR_SHEETS_ID}/values/{RANGE}?access_token={YOUR_TOKEN}'
```

  - In **Node**:
```ts
import 'dotenv/config';
import { oAuth2Client, authorizeUrl } from 'YOUR_PATH_SAVE_IT';
import { google } from 'googleapis';

/**
 * Read data from a Google Sheets spreadsheet.
 * @param {JSON} token - The token to authenticate the user.
 * @param {string} spreadsheetId - The ID of the spreadsheet to read data from.
 * @param {string} range - The range of the spreadsheet to read data from. (Example: 'Users', 'Users!A1:F3')
 */
const readData = async (
    token: JSON | undefined,
    spreadsheetId: string | undefined,
    range: string | undefined,
): Promise<any> => {
    await oAuth2Client.setCredentials(token);
    const googleSheets: any = google.sheets({ version: 'v4', auth: oAuth2Client });

    try {
        const res: any = await googleSheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });

        const rows: any[][] | null | undefined = res.data.values;

        if (rows && rows.length) {
            console.log('Name sheet and range: ' + range);
            rows.map(row => {
                console.log(row);
            });
        } else {
            console.log('No data found.');
        }
    } catch (err) {
        throw new Error('The API returned an error: ' + err + ' (ERR: readData in )' + __dirname);
    }
};
```

- **Upgrade, del,... : read at [src](src/)** 



