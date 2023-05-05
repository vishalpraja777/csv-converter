import { useState } from "react";
import React from "react";
import Navbar from "./Navbar";

const CreateMap = () => {

    // CSV fields
    const [csvFile, setCsvFile] = useState('')
    const [csvFileName, setCsvFileName] = useState('')

    // JSON Fields
    const [jsonFile, setJsonFile] = useState('')
    const [jsonFileName, setJsonFileName] = useState('')

    const [csvHeaders, setCsvHeaders] = useState([]);
    const [jsonHeaders, setJsonHeaders] = useState([]);

    const [isUploaded, setIsUploaded] = useState(false);

    // CSV drag and drop
    const handleDrageOverCsv = (event) => {
        event.preventDefault();
    }

    const handleDropCsv = (event) => {
        event.preventDefault();
        setCsvFile(event.dataTransfer.files[0])
        setCsvFileName(event.dataTransfer.files[0].name)
        console.log(event.dataTransfer.files[0])
    }

    // JSON drag and drop
    const handleDrageOverJson = (event) => {
        event.preventDefault();
    }

    const handleDropJson = (event) => {
        event.preventDefault();
        setJsonFile(event.dataTransfer.files[0])
        setJsonFileName(event.dataTransfer.files[0].name)
        console.log(event.dataTransfer.files[0])
    }

    const handeNew = (event) => {
        event.preventDefault();
        setIsUploaded(false);
        setCsvHeaders([]);
        setJsonHeaders([]);
        setCsvFile('');
        setJsonFile('');
        setCsvFileName('');
        setJsonFileName('');
    }


    async function uplaodFile(event) {
        event.preventDefault()

        if (!csvFileName.endsWith(".csv")) {
            alert("Please Upload a valid CSV file")
            window.location.reload()
            return
        }

        if (!jsonFileName.endsWith(".json")) {
            alert("Please Upload a vald JSON file")
            window.location.reload()
            return
        }

        const csvFormData = new FormData();
        const jsonFormData = new FormData();
        if (csvFile && jsonFile) {
            csvFormData.append('name', 'csv_file');
            csvFormData.append('file', csvFile);

            jsonFormData.append('name', 'json_file');
            jsonFormData.append('file', jsonFile);


            console.log(...csvFormData)
            console.log(...jsonFormData)

            // const formData = new FormData();
            // formData.append('csv', csvFile);
            // formData.append('json', jsonFile);

            // try{
            // const response = await fetch('http://localhost:1337/api/bothupload', {
            //     method: 'POST',
            //     body: formData,
            // });

            // const data = await response.json();

            // console.log(data)


            //     setCsvHeaders(data.csvHeaders);
            //     setJsonHeaders(data.jsonHeaders);

            // } catch(err) {
            //     console.log(err)
            // }
            const csvResponse = await fetch('http://localhost:1337/api/uploadcsv', {
                method: 'POST',
                body: csvFormData
            })

            const jsonResponse = await fetch('http://localhost:1337/api/uploadjson', {
                method: 'POST',
                body: jsonFormData
            })

            const csvData = await csvResponse.json()
            const jsonData = await jsonResponse.json()

            console.log(csvData.csvHeaders)
            console.log(jsonData.jsonHeaders)

            setCsvHeaders(csvData.csvHeaders);
            setJsonHeaders(jsonData.jsonHeaders);

            if (csvData.status === 'ok' && jsonData.status === 'ok') {
                alert('File Uploaded')
                setIsUploaded(true)
            } else {
                alert("File couldn't be uploaded")
            }
        }

        else {
            alert('Click Upload')
        }

    }

    return (
        <div>
            <Navbar />
            <h1>CreateMap</h1>
            <div className="upload">
                {!isUploaded &&
                    <div>
                        <form onSubmit={uplaodFile}>
                            <div className="bothUpload">
                                <div
                                    className="dragUpload"
                                    onDragOver={handleDrageOverCsv}
                                    onDrop={handleDropCsv}
                                >
                                    <p>Drag to upload CSV file</p>
                                    {!csvFile && <input type="file" name="file" id="files" onChange={(e) => { setCsvFile(e.target.files[0]); setCsvFileName(e.target.files[0].name) }} />}
                                    {csvFile && <p>File Name: {csvFileName}</p>}
                                    <br />
                                </div>
                                <div
                                    className="dragUpload"
                                    onDragOver={handleDrageOverJson}
                                    onDrop={handleDropJson}
                                >
                                    <p>Drag to upload JSON file</p>
                                    {!jsonFile && <input type="file" name="file" id="files" onChange={(e) => { setJsonFile(e.target.files[0]); setJsonFileName(e.target.files[0].name) }} />}
                                    {jsonFile && <p>File Name: {jsonFileName}</p>}
                                    <br />
                                </div>
                            </div>
                            <input type="submit" value="Upload" className="btnU" />
                        </form>
                    </div>
                }
                { isUploaded && <div>
                    <button className="btnU" onClick={handeNew}>Upload New</button>
                </div> }
                <div className="mappingContent">
                    <div className="csvContent">
                        <h1>CSV Headers</h1>
                        {
                            csvHeaders.map((header) => (
                                <div>
                                    <p>{header}</p>
                                </div>
                            ))
                        }
                    </div>
                    <div className="jsonContent">
                        <h1>Json Headers</h1>
                        {
                            jsonHeaders.map((header) => (
                                <div>
                                    <p>{header}</p>
                                </div>
                            ))
                        }
                    </div>
                    {/* <p>CSV Headers: {csvHeaders.join(', ')}</p>
                    <p>JSON Headers: {jsonHeaders.join(', ')}</p> */}
                </div>
            </div>
        </div>
    );
}

export default CreateMap;