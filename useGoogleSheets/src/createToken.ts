import 'dotenv/config';
import express, { Request, Response } from 'express';
import { oAuth2Client, authorizeUrl } from './oAuth2';
import fs from 'fs';

const sever = express();
const port: number = Number.parseInt(process.env.PORT || '') || 3300;
const tokenPath: string = 
    process.env.PATH_TOKEN || 
    __dirname.split('/').slice(0, -1).join('/') + '/token.json';

const writeToken = (tokens: any) => {
    fs.writeFileSync(tokenPath, JSON.stringify(tokens));
};

sever.get('/',  async (req: Request, res: Response) => {
    res.redirect(authorizeUrl);
});

// sever.get('/oauth2callback', async (req: Request, res: Response) => {
//     const code: string = req.query.code as string;

//     const { tokens } = await oAuth2Client.getToken(code);

//     writeToken(tokens);

//     res.send('Authentication successful! Please return to the console.');
// });

sever.listen(port, () => {
    console.log(`Server listening on: http://localhost:${port}`);
});

export const createToken = async () => {
    
    const code: string = await new Promise((resolve) => {
        sever.get('/oauth2callback', (req: Request, res: Response) => {
            const code: string = req.query.code as string;
            res.send('Authentication successful! Please return to the console.');
            resolve(code);
        });
    });

    const { tokens } = await oAuth2Client.getToken(code);

    writeToken(tokens);
};