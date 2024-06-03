
import { createToken }  from "./createToken";
import fs from 'fs';

const tokenPath: string = 
    process.env.PATH_TOKEN || 
    __dirname.split('/').slice(0, -1).join('/') + '/token.json';


const readToken = (): any => {
    return JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
}

console.log(readToken());

