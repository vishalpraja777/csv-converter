import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import Navbar from "./Navbar";
import jwtDecode from "jwt-decode";
import './About.css';
import bg from './images/bg.webp'

const CreateXmlMap = () => {

    const userToken = localStorage.getItem('token')

    const userDecode = jwtDecode(userToken)
    const navigate = useNavigate();


    // CSV fields
    const [csvFile, setCsvFile] = useState('')
    const [csvFileName, setCsvFileName] = useState('')

    // XML Fields
    const [xmlFile, setxmlFile] = useState('')
    const [xmlFileName, setxmlFileName] = useState('')

    const [csvHeaders, setCsvHeaders] = useState([]);
    const [xmlHeaders, setxmlHeaders] = useState([]);

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

    // XML drag and drop
    const handleDragOverXml = (event) => {
        event.preventDefault();
    }

    const handleDropXml = (event) => {
        event.preventDefault();
        setxmlFile(event.dataTransfer.files[0])
        setxmlFileName(event.dataTransfer.files[0].name)
        console.log(event.dataTransfer.files[0])
    }

    const handleNew = (event) => {
        event.preventDefault();
        setIsUploaded(false);
        setCsvHeaders([]);
        setxmlHeaders([]);
        setCsvFile('');
        setxmlFile('');
        setCsvFileName('');
        setxmlFileName('');
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


        const response = await fetch('http://localhost:1337/api/createxmlmapping', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                userId: localStorage.getItem('userid'),
                mapName: mappingName,
                mappingData: mapping,
                csvHeader: csvHeaders,
                xmlHeader: xmlHeaders,
                mappingType: 'xml'
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
    }

    async function uplaodFile(event) {
        event.preventDefault()

        if (!csvFileName.endsWith(".csv")) {
            alert("Please Upload a valid CSV file")
            window.location.reload()
            return
        }

        if (!xmlFileName.endsWith(".xml")) {
            alert("Please Upload a vald XML file")
            window.location.reload()
            return
        }

        const csvFormData = new FormData();
        const xmlFormData = new FormData();
        if (csvFile && xmlFile) {
            csvFormData.append('name', 'csv_file');
            csvFormData.append('file', csvFile);

            xmlFormData.append('name', 'xml_file');
            xmlFormData.append('file', xmlFile);


            console.log(...csvFormData)
            console.log(...xmlFormData)

            const csvResponse = await fetch('http://localhost:1337/api/uploadcsv', {
                method: 'POST',
                body: csvFormData
            })

            // const xmlResponse = await fetch('http://localhost:1337/api/uploadxml', {
            //     method: 'POST',
            //     body: xmlFormData
            // })ss

            const xmlResponse = await fetch('http://localhost:1337/api/uploadnestedxml', {
                method: 'POST',
                body: xmlFormData
            })

            const csvData = await csvResponse.json()
            const xmlData = await xmlResponse.json()

            // console.log(xmlResponse.json())
            console.log(xmlData.jsonHeaders)

            setCsvHeaders(csvData.csvHeaders);
            setxmlHeaders(xmlData.jsonHeaders);



            if (csvData.status === 'ok' && xmlData.status === 'ok') {
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
            <div >
                {!isUploaded &&
                    <div>
                        <form onSubmit={uplaodFile}>
                            <div class = "flex justify-end space-x-10 mr-10">
                                <div class = "mt-32 ml-96 bg-black text-white  w-3/5 px-24 py-4 pt-6 mr-28"
                                    onDragOver={handleDrageOverCsv}
                                    onDrop={handleDropCsv}
                                >
                                    <p>Drag or upload sample CSV file</p>
                                    {!csvFile && <input type="file" name="file" id="files" onChange={(e) => { setCsvFile(e.target.files[0]); setCsvFileName(e.target.files[0].name) }} />}
                                    {csvFile && <p>File Name: {csvFileName}</p>}
                                    <br />  
                                </div>
                                <div class = "mt-32 ml-96 bg-black text-white  w-3/5 px-24 py-4 pt-6 mr-28"
                                   
                                    onDragOver={handleDragOverXml}
                                    onDrop={handleDropXml}
                                >
                                    <p>Drag or upload sample XML file</p>
                                    {!xmlFile && <input type="file" name="file" id="files" onChange={(e) => { setxmlFile(e.target.files[0]); setxmlFileName(e.target.files[0].name) }} />}
                                    {xmlFile && <p>File Name: {xmlFileName}</p>}
                                    <br />
                                </div>
                            </div>
                            <div class = "flex justify-end py-16 mt-7">
                            <input class="  bg-black text-white  font-semibold mr-10 text-3xl  flex p-3 rounded-3xl hover:bg-gray-400 active:bg-slate-200" type="submit" value="Upload"/>
                                <p> </p>
                            </div>
                        </form>
                    </div>
                }
                {isUploaded && <div>
                    
                    <div class = "flex space-x-64 px-44 mt-16 ml-96 justify-end mr-18" >
                        {<div >
                            <h1 class = "font-bold underline mb-4 text-lg">XML Headers</h1>
                            {
                                xmlHeaders?.map((header) => (
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
                            <h1 class = "font-bold underline mb-4 text-lg">CSV Headers</h1>
                            {
                                csvHeaders?.map((header) => (
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
                    </div>
                    <form class = "ml-96 flex justify-end space-x-32 mr-96 mt-8 " onSubmit={createMapping} >
                        <input class="  bg-black text-white  font-semibold mr-10 " type="text" onChange={(e) => { setMapName(e.target.value) }} placeholder="Map Name" s />
                        <input class="  bg-black text-white  font-semibold mr-10 text-xl p-3 rounded-3xl hover:bg-gray-400 active:bg-slate-200 mb-8 "  type="submit" value="Create Mapping"  />
                    </form>
                    <div class  = "ml-96 flex justify-end space-x-32 mr-96 mt-8">
                        <button class="  bg-black text-white ml-96  font-semibold mr-10 text-xl  flex p-3 rounded-3xl hover:bg-gray-400 active:bg-slate-200"  onClick={handleNew}>Upload New Files</button>
                        <p></p>
                        </div>
                </div>
                }
            </div>
        </div>
        </div>
     );
}
 
export default CreateXmlMap;