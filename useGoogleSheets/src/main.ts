import 'dotenv/config';
import { createToken } from './Data/connectData/createToken';
import fs from 'fs';
import { readData } from './Data/handleData/handleData';


const tokenPath: string = process.env.PATH_TOKEN || __dirname + '/token.json';
const SHEETS_ID: string = process.env.SHEETS_ID || '';

const readToken = (): JSON | undefined => {
    try {
        return JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    } catch (error) {
        console.log('Error reading token, please check if the token file exists. (src/token.json)');
    }
};

const main = async (): Promise<any> => {
    let token: JSON | undefined = await readToken();
    if (!token) {
        console.log('Token not found, creating token...');
        await createToken();
        token = await readToken();
    }
    console.log('Token check ok!');

    await readData(token, SHEETS_ID, 'Users');
};

main();
