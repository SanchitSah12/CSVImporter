import { useState } from "react";
import FileUpload from "./UploadSection/FileUpload";
import axios from 'axios';
import Loader from "./Loader";
import CongratsScreen from "./CongratsScreen";
const MainSection = () => {
    const [uploadedFile, setUploadedFile] = useState();
    const [responseMessage, setResponseMessage] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sheetLink, setSheetLink] = useState(null);
    const [sheetName, setSheetName] = useState("")

    const handleFileUpload = async (files) => {
        // Create a new FormData object
        const formData = new FormData();
        // Append the file to the FormData object
        formData.append("file", files[0]);

        // Make a POST request to your backend endpoint
        const response = await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData,
        });

        // Handle the response from the backend
        const data = await response.json();
        console.log(data);

        // Update the uploaded files state
        setUploadedFile(files[0]);

        // Update the response message state
        setResponseMessage(data);
        setShowPopup((prev) => !prev);
    };



    const handleColumnSelection = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        setShowPopup((prev) => !prev);
        // Append the file to the FormData object
        formData.append("data", uploadedFile);
        formData.append("columns", selectedColumns);
        formData.append("sheetName", sheetName);

        console.log(selectedColumns);
        try {
            const response = await axios.post('http://localhost:3000/spreadsheet', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSheetLink(response.data);
            setIsLoading(false);
            console.log(response);
            // Handle the server's response
        } catch (error) {
            // Handle errors
            console.error(error);
        }
        // Make a POST request to your backend endpoint
    };

    return (
        <>
            <Loader isLoading={isLoading}></Loader>
            <CongratsScreen sheetLink={sheetLink}></CongratsScreen>
            {showPopup && (
                <div className="card card-compact w-96 bg-base-100 shadow-xl absolute left-0 right-0 ml-auto mr-auto top-40">
                    <div className="card-body">
                        <h1 className="font-bold text-base">Choose what columns you want to include</h1>
                        <form onSubmit={handleColumnSelection}>
                            <ul>
                                {responseMessage.map((columnName, index) => (
                                    <li className="font-mono text-lg" key={index}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={columnName}
                                                checked={selectedColumns.includes(columnName)}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        setSelectedColumns([...selectedColumns, columnName]);
                                                    } else {
                                                        setSelectedColumns(selectedColumns.filter((name) => name !== columnName));
                                                    }
                                                }}
                                            />
                                            <span className="px-3">{columnName}</span>
                                        </label>

                                    </li>
                                ))}
                                <input type="text" onChange={(e) => {
                                    setSheetName(e.target.value);
                                }} value={sheetName}
                                    placeholder="Name of the spreadsheet"
                                    className="mt-3 input input-bordered input-accent w-full max-w-xs"
                                />
                            </ul>
                            <button className="btn btn-accent mt-3" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col">

                <h1 className="text-center font-bold text-2xl mb-10">Drag and Drop File Upload</h1>
                <FileUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} />
            </div>
        </>
    );
};

export default MainSection;