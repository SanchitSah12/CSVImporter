const { google } = require('googleapis');
const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const credentials = require('./keys.json');

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});

module.exports = auth;



