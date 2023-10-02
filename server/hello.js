const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "creds.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
const authorize = async () => {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
};

// /**
//  * Prints the names and majors of students in a sample spreadsheet:
//  * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
//  * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
//  */

async function listMajors(auth, csvFile, columnNames,sheetName) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheet = await sheets.spreadsheets.create({
    resource: {
      properties: {
        title: sheetName,
      },
    },
  });

  // Get the ID of the new spreadsheet
  const spreadsheetId = spreadsheet.data.spreadsheetId;


  const lines = csvFile.buffer.toString().split('\n');
  const insideCols = lines[0]
    .split(",")
    .map((columnName) => columnName.trim());
  const data = lines.slice(1).map((line) => {
    const rowData = {};
    line.split(",").forEach((value, index) => {
      const columnName = insideCols[index];
      if (columnNames.includes(columnName)) {
        rowData[columnName] = value.trim();
      }
    });
    return Object.values(rowData);
  });

  console.log(data);

  const stringifiedData = data.map((row) => row.map((value) => String(value)));
  // Write the data to the new sheet
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Sheet1!A1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [columnNames, ...stringifiedData],
    },
  });

  // Send the URL of the new spreadsheet in the response
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
}

module.exports = { authorize, listMajors };
// authorize().then(listMajors).catch(console.error);
