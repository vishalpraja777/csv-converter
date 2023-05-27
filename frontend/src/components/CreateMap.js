import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import Navbar from "./Navbar";
import jwtDecode from "jwt-decode";
import './About.css';
import bg from './images/bg.webp'


const CreateMap = () => {

    const userToken = localStorage.getItem('token')

    const userDecode = jwtDecode(userToken)
    const navigate = useNavigate();


    // CSV fields
    const [csvFile, setCsvFile] = useState('')
    const [csvFileName, setCsvFileName] = useState('')

    // JSON Fields
    const [jsonFile, setJsonFile] = useState('')
    const [jsonFileName, setJsonFileName] = useState('')

    const [csvHeaders, setCsvHeaders] = useState([]);
    const [jsonHeaders, setJsonHeaders] = useState([]);

    const [isUploaded, setIsUploaded] = useState(false);

    const [mappings, setMappings] = useState(new Map());
    const [mapName, setMapName] = useState('');

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

    const handleNew = (event) => {
        event.preventDefault();
        setIsUploaded(false);
        setCsvHeaders([]);
        setJsonHeaders([]);
        setCsvFile('');
        setJsonFile('');
        setCsvFileName('');
        setJsonFileName('');
        setMappings(new Map())
    }

    const handleDragOverMap = (e) => {
        e.preventDefault()
    }

    const handleDropMap = (e, header) => {
        e.preventDefault()
        const droppedText = e.dataTransfer.getData("text");

        mappings.set(header, droppedText);
        setMappings(new Map(mappings))

        console.log(droppedText);
        console.log(header);
        console.log(mappings);

    }

    const handleOnDragStart = (e, textData) => {
        e.dataTransfer.setData("text", textData)
    }

    async function createMapping(e) {
        e.preventDefault()
        console.log(mappings)

        if (!mapName) {
            alert('Enter Map name')
            return
        }

        const mapping = {}
        for (let [key, value] of mappings) {
            mapping[key] = value;
        }

        console.log(mapping)
        console.log(userDecode.email)
        console.log(localStorage.getItem('userid'))

        const mappingName = mapName.toLowerCase()


        const response = await fetch('http://localhost:1337/api/createmapping', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                userId: localStorage.getItem('userid'),
                mapName: mappingName,
                mappingData: mapping,
                csvHeader: csvHeaders,
                jsonHeader: jsonHeaders,
                mappingType: 'json'
            }),
        })

        const data = await response.json();

        if (data.status === 'ok') {
            console.log(response.status)
            alert('Mapping Created')
            navigate('/homepage')
        }
        if (data.status === 'error') {
            alert('Map name already exists \nEnter a new map name')
        }
        // .then(response => {
        //     console.log(response.status)
        //         alert('Mapping Created')
        //         navigate('/')
        // })
        // .catch(error => {
        //     console.log(error)
        //     alert('Enter a new map name')
        // });
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

            console.log(jsonData.jsonHeaders)
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
            <div class="w-full h-1/4 bg-no-repeat bg-cover bg-center bg-fixed" 
             style={{ backgroundImage: `url(${bg})` }}>
                <div class="h-full  w-full  pt-10 px-20">

                <p class="text-6xl text-gray-900 font-serif pt-10 px-20"> CSV Conversion</p>
                <p class="px-36 text-6xl text-gray-900 font-serif "> Tool</p></div>
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
                                    <p>Drag to upload sample CSV file</p>
                                    {!csvFile && <input type="file" name="file" id="files" onChange={(e) => { setCsvFile(e.target.files[0]); setCsvFileName(e.target.files[0].name) }} />}
                                    {csvFile && <p>File Name: {csvFileName}</p>}
                                    <br />
                                </div>
                                <div
                                    className="dragUpload"
                                    onDragOver={handleDrageOverJson}
                                    onDrop={handleDropJson}
                                >
                                    <p>Drag to upload sample JSON file</p>
                                    {!jsonFile && <input type="file" name="file" id="files" onChange={(e) => { setJsonFile(e.target.files[0]); setJsonFileName(e.target.files[0].name) }} />}
                                    {jsonFile && <p>File Name: {jsonFileName}</p>}
                                    <br />
                                </div>
                            </div>
                            <input type="submit" value="Upload" className="btnU" />
                        </form>
                    </div>
                }
                {isUploaded && <div>
                    <button className="btnU" onClick={handleNew}>Upload New Files</button>

                    <div className="mappingContent">
                        {<div className="csvContent">
                            <h1>CSV Headers</h1>
                            {
                                csvHeaders.map((header) => (
                                    <div>
                                        <div
                                            className="dragDiv"
                                            onDragOver={handleDragOverMap}
                                            onDrop={(e) => { handleDropMap(e, header) }}
                                        >
                                            <div className="mapKey borderCommon">{header}</div>
                                            <div style={{ marginLeft: "20px" }}>=&gt;</div>
                                            <div className="mapValue borderCommon">{mappings.get(header)}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>}

                        {<div className="jsonContent">
                            <h1>Json Headers</h1>
                            {
                                jsonHeaders.map((header) => (
                                    <div
                                        className="jsonItem1"
                                        draggable
                                        onDragStart={(e) => { handleOnDragStart(e, header) }}
                                    >
                                        <div className="jsonItem borderCommon">{header}</div>
                                        <br />
                                    </div>
                                ))
                            }
                        </div>}
                        {/* <table>
                            <tr>
                                <th>CSV Content</th>
                                <th>Mapped To</th>
                                <th>JSON Content</th>
                            </tr>
                            <tr>
                                <td>
                                {
                                csvHeaders.map((header) => (
                                    <div>
                                        <div
                                            className="dragDiv"
                                            onDragOver={handleDragOverMap}
                                            onDrop={(e) => { handleDropMap(e, header) }}
                                        >
                                            <div className="mapKey borderCommon">{header}</div>
                                            <div style={{ marginLeft: "20px" }}>=&gt;</div>
                                            <div className="mapValue borderCommon">{mappings.get(header)}</div>
                                        </div>
                                    </div>
                                ))
                            }
                                </td>
                                <td>
                                    
                                </td>
                                <td>
                                {
                                jsonHeaders.map((header) => (
                                    <div
                                        className="jsonItem1"
                                        draggable
                                        onDragStart={(e) => { handleOnDragStart(e, header) }}
                                    >
                                        <div className="jsonItem borderCommon">{header}</div>
                                        <br />
                                    </div>
                                ))
                            }
                                </td>
                            </tr>
                        </table> */}
                    </div>
                    <form onSubmit={createMapping} className="mapForm">
                        <input type="text" onChange={(e) => { setMapName(e.target.value) }} placeholder="Map Name" className="input" />
                        <input type="submit" value="Create Mapping" className="btn" />
                    </form>
                </div>
                }
            </div>
        </div>
        </div>
    );
}

export default CreateMap;