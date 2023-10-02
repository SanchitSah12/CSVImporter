# CSVImporter
A react full stack app that helps users import a CSV file to Google Sheets
`In this project, I have used React and Node js to develop a full stack app`

For this, I am using the Sheets API to authenticate and insert data in the sheets

The frontend is used to upload the CSV file using React Dropzone 

then sends it to the backend for validation 


the backend sends the column names that the frontend to select column names from the user


once the user selects the column name, the request is sent to the backend to connect with the sheets API create a sheet, and populate the sheet
