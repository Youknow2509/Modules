import 'dotenv/config';
import express, { Request, Response } from 'express';
import { oAuth2Client, authorizeUrl } from './oAuth2';
import fs from 'fs';

const sever: express.Express = express();
const port: number = 
    Number.parseInt(process.env.PORT || '') || 
    3300;
const tokenPath: string = 
    __dirname.split('/').slice(0, -2).join('/') + '/token.json';

export const createToken = async () => {

    sever.get('/',  async (req: Request, res: Response) => {
        res.redirect(authorizeUrl);
    });

    sever.listen(port, () => {
        console.log(`Server listening on: http://localhost:${port} create token...`);
    });

    const code: string = await new Promise((resolve) => {
        sever.get('/oauth2callback', (req: Request, res: Response) => {
            const code: string = req.query.code as string;
            res.send('Authentication successful! Please return to the console.');
            resolve(code);
        });
    });

    const { tokens } = await oAuth2Client.getToken(code);
    
    await writeToken(tokens);

    console.log('Token created successfully');
    return tokens;
};

const writeToken = (tokens: any): void => {
    fs.writeFileSync(tokenPath, JSON.stringify(tokens));
};