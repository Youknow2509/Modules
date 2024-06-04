import 'dotenv/config';
import { createToken } from './Data/connectData/createToken';
import fs from 'fs';
import { readData } from './Data/handleData/handleData';

const tokenPath: string = process.env.PATH_TOKEN || __dirname + '/token.json';
const SHEETS_ID: string = process.env.SHEETS_ID || '';

const main = async (): Promise<any> => {
    let token: JSON | undefined = undefined;
    await readToken()
        .then((data) => {
        token = data;
    });
    await readData(token, SHEETS_ID, 'Users');
};

const readToken = async(): Promise<any>=> {
    let token: JSON | undefined = undefined;
    try {
        const temp = await fs.readFileSync(tokenPath, 'utf8');
        if (temp) {
            token = JSON.parse(temp);
        } else {
            await createToken().then((data) => {
                token = data;
            });
        }
        return token;
    } catch (error) {
        console.log('Error reading token, please check if the token file exists. (src/token.json)');
    }
};


main()
    .catch((error) => {
        console.log('Error: ', error);
    });




