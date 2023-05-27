import React from "react";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
// import { useNavigate } from "react-router-dom";

const UseMap = () => {

    const [csvFile, setCsvFile] = useState('')
    const [csvFileName, setCsvFileName] = useState('')
    const [fileUploaded, setFileUploaded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [main, setMain] = useState(true)
    const [mapData, setMapData] = useState()

    const [optValue, setOptValue] = useState('')
    const [optSelected, setOptSelected] = useState('')
    const [mappingIdSelected, setMappingIdSelected] = useState()
    const [conversionName, setConversionName] = useState()

    const [jsonFilePath, setJsonFilePath] = useState('')

    useEffect(() => {
        console.log(localStorage.getItem('userid'))
        fetch(`http://localhost:1337/api/getmapdata/${localStorage.getItem('userid')}`)
            .then((response) => {
                const reader = response.body.getReader();
                console.log(reader)
                reader.read().then(({ done, value }) => {
                    if (done) {
                        console.log('end...')
                        return;
                    }
                    const decoder = new TextDecoder();
                    const strData = decoder.decode(value)
                    const jsonData = JSON.parse(strData)
                    console.log(jsonData)
                    setMapData(jsonData)
                });
            })
    }, [])

    // const navigate = useNavigate();

    // const formData = new FormData();

    const handleDrageOverCsv = (event) => {
        event.preventDefault();
    }

    const handleDropCsv = (event) => {
        event.preventDefault();
        setCsvFile(event.dataTransfer.files[0])
        setCsvFileName(event.dataTransfer.files[0].name)
        console.log(event.dataTransfer.files[0])
    }


    async function uplaodFile(event) {
        event.preventDefault()

        console.log(conversionName)
        if(!conversionName) {
            alert('Enter conversion name')
            return
        }

        setIsLoading(true);
        setMain(false);

        // const files = document.getElementById("files");

        // setCsvFile(files.files[0])
        // setFileName(files.files[0].name)

        // console.log(document.querySelector("#files"))
        // setCsvFile(event.target.files);
        // setCsvFile(document.querySelector("#files"));
        // console.log(csvFile)

        if (!csvFileName.endsWith(".csv") || !csvFileName) {
            alert("Please Upload a valid CSV file")
            window.location.reload()
            return
        }

        if (!optSelected) {
            alert('Select Mapping')
            setIsLoading(false)
            setMain(true)
            return
        }

        const csvFormData = new FormData();
        if (csvFile) {
            csvFormData.append('name', 'csv_file');
            // formData.append('file', files.files[0]);
            csvFormData.append('file', csvFile);
            csvFormData.append('mappingName', optValue);
            csvFormData.append('mappingId', mappingIdSelected);
            csvFormData.append('conversionName', conversionName);
            csvFormData.append('userId', localStorage.getItem('userid'));
            csvFormData.append('mappingData', JSON.stringify(optSelected));



            console.log(...csvFormData)

            const csvResponse = await fetch('http://localhost:1337/api/uploadcsvtoconvert', {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'text/csv'
                // },
                body: csvFormData
            })

            // .then(res => console.log(res.json()))
            // .catch(err => console.log(err));

            const csvData = await csvResponse.json()

            console.log(csvData.jsonFilename)
            setJsonFilePath(csvData.jsonFilename)
            console.log('OPT:' + optSelected)

            setConversionName('')

            if (csvData.status === 'ok') {
                alert('File Uploaded')
                setIsLoading(false)
                setFileUploaded(true)
            } else {
                alert("File couldn't be uploaded \nEnter a new Conversion name")
                setIsLoading(false)
                setMain(true)
            }
        }

        else {
            alert('Click Upload')
        }

    }

    async function handleDownload(e) {
        e.preventDefault()
        await fetch('http://localhost:1337/api/downloadjson', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                filename: jsonFilePath,
                type: 'json'
            })
        })
            .then(res => {
                res.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'output_' + jsonFilePath.slice(14);
                    a.click();
                });
            });

        alert('File Downloaded')

        //  setFileUploaded(false)
        //  setMain(true)
        //  setCsvFile('')

    }

    const setMapValues = (e) => {
        setOptValue(e.target.value)
        console.log(e.target.value)
        console.log(mapData)
        mapData.map((item) => {
            if (item.mappingname === e.target.value) {
                setOptSelected(item.mappingdata)
                setMappingIdSelected(item._id)
                console.log(item._id)
                console.log(item.mappingdata)
            }
        })
    }

    return (
        <div>
            <Navbar />
            <h1>UseMap</h1>
            {main && <div className="upload">
                <form onSubmit={uplaodFile}>
                    <div className="fileOptions">
                        <div
                            className="dragUpload"
                            onDragOver={handleDrageOverCsv}
                            onDrop={handleDropCsv}
                        >
                            <p>Drag to upload CSV file</p>
                            {<input type="file" name="file" id="files" onChange={(e) => { setCsvFile(e.target.files[0]); setCsvFileName(e.target.files[0].name) }} />}
                            {csvFile && <p>File Name: {csvFileName}</p>}
                            <br />
                        </div>
                        <div className="options">
                            <select name="Mappings" id="mappings" value={optValue} onChange={setMapValues}>
                                <option selected>--Select--</option>
                                {
                                    mapData?.map(item => <option>{item.mappingname}</option>)
                                }
                            </select>
                        </div>
                        <input type="text" onChange={(e) => { setConversionName(e.target.value) }} placeholder="Conversion Name" className="input" style={{width:'25%',margin:'auto'}}/>
                    </div>
                    <input type="submit" value="Upload" className="btnU" />
                </form>
            </div>}
            {isLoading && <div>Loading...</div>}
            {fileUploaded && <div>
                <form onSubmit={handleDownload}>
                    <button type="submit" className="btnU">Download</button>
                </form>
                <button onClick={() => { setMain(true); setFileUploaded(false); setCsvFile('') }} className="btnU">Upload Another</button>
            </div>}
        </div>
    );
}

export default UseMap;