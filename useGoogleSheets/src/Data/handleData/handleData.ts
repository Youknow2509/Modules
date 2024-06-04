import 'dotenv/config';
import { oAuth2Client, authorizeUrl } from '../connectData/oAuth2';
import { google } from 'googleapis';

export { readData, updateData, appendData };

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

        return rows;
    } catch (err) {
        throw new Error('The API returned an error: ' + err + ' (ERR: readData in )' + __dirname);
    }
};

/**
 * Update the data in a Google Sheets spreadsheet.
 * @param {JSON} token - The token to authenticate the user.
 * @param {string} spreadsheetId - The ID of the spreadsheet to update data in.
 * @param {string} range - The range of the spreadsheet to update data in. (Example: 'Users', 'Users!A1:F3')
 * @param {string} valueInputOption - How the input data should be interpreted. (Example: 'RAW', 'USER_ENTERED')
 * @param {(string[])[]} _values - A 2d array of values to update.
 */
const updateData = async (
    token: JSON | undefined,
    spreadsheetId: string | undefined,
    range: string | undefined,
    valueInputOption: string | undefined = 'USER_ENTERED',
    _values: string[][] | undefined,
): Promise<any> => {
    await oAuth2Client.setCredentials(token);
    const googleSheets: any = google.sheets({ version: 'v4', auth: oAuth2Client });

    const resource: any = {
        values: _values,
    };

    try {
        const result = await googleSheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        });
        console.log('%d cells updated.', result.data.updatedCells);
        return result;
    } catch (err) {
        throw new Error('The API returned an error: ' + err + ' (ERR: updateData in )' + __dirname);
    }
};

/**
 * Append data to a Google Sheets spreadsheet.
 * @param {JSON} token - The token to authenticate the user.
 * @param {string} spreadsheetId - The ID of the spreadsheet to append data to.
 * @param {string} range - The range of the spreadsheet to append data to. (Example: 'Users', 'Users!A1:F3')
 * @param {string} valueInputOption - How the input data should be interpreted. (Example: 'RAW', 'USER_ENTERED')
 * @param {(string[])[]} _values - A 2d array of values to append.
 */
const appendData = async (
    token: JSON | undefined,
    spreadsheetId: string | undefined,
    range: string | undefined,
    valueInputOption: string | undefined = 'USER_ENTER',
    _values: string[][] | undefined,
) => {
    await oAuth2Client.setCredentials(token);
    const googleSheets: any = google.sheets({ version: 'v4', auth: oAuth2Client });

    const resource: any = {
        values: _values,
    };

    try {
        const result = await googleSheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        });
        console.log(`${result.data.updates.updatedCells} cells appended.`);
        return result;
    } catch (err) {
        throw new Error('The API returned an error: ' + err + ' (ERR: appendData in )' + __dirname);
    }
};
