import React from "react";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import './About.css';
import bg from './images/bg.webp'


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
    const [mappingType, setMappingType] = useState('')
    const [conversionName, setConversionName] = useState()

    const [jsonFilePath, setJsonFilePath] = useState('')
    const [xmlFilePath, setXmlFilePath] = useState('')

    const [conversionData, setConversionData] = useState()
    const [csvHeaders, setCsvHeaders] = useState()
    const [csvHeadersItem, setCsvHeadersItem] = useState()
    const [item, setItem] = useState()
    const [uploadClick, setUploadClick] = useState(false)

    useEffect(() => {
        console.log(localStorage.getItem('userid'))
        fetch(`http://localhost:1337/api/getmapdata/${localStorage.getItem('userid')}`)
            .then((response) => {
                const reader = response.body.getReader();
                // console.log(reader)
                reader.read().then(({ done, value }) => {
                    if (done) {
                        console.log('end...')
                        return;
                    }
                    const decoder = new TextDecoder();
                    const strData = decoder.decode(value)
                    const jsonData = JSON.parse(strData)
                    // console.log(jsonData)
                    setMapData(jsonData)
                });
            })

        fetch(`http://localhost:1337/api/getconversiondata/${localStorage.getItem('userid')}`)
            .then((response) => {
                const reader = response.body.getReader();
                // console.log(reader)
                reader.read().then(({ done, value }) => {
                    if (done) {
                        console.log('end...')
                        return;
                    }
                    const decoder = new TextDecoder();
                    const strData = decoder.decode(value)
                    const jsonData = JSON.parse(strData)
                    // console.log(jsonData)
                    setConversionData(jsonData)
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

        

        if(!uploadClick) {
            alert('Click On Upload')
            return
        }
        setUploadClick(false)

        // console.log(conversionName)
        if (!conversionName) {
            alert('Enter conversion name')
            return
        }



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

        for (let item in conversionData) {
            // console.log(conversionName + conversionData[item].conversionname)
            if (conversionName.toLowerCase() === conversionData[item].conversionname) {
                alert('Conversion name already present')
                return
            }
        }

        for (let i in csvHeadersItem) {
            if (csvHeadersItem[i] !== csvHeaders[i]) {
                console.log(csvHeadersItem[i])
                console.log(csvHeaders[i])
                alert("Headers not matching upload new file")
                return
            }
        }

        setIsLoading(true);
        setMain(false);

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
            csvFormData.append('mappingType', mappingType);



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

            if (mappingType === 'json') {
                console.log(csvData.jsonFilename)
                setJsonFilePath(csvData.jsonFilename)
            } else if (mappingType === 'xml') {
                console.log(csvData.xmlFilename)
                setXmlFilePath(csvData.xmlFilename)
            }

            console.log('OPT:' + optSelected)

            setConversionName('')

            if (csvData.status === 'ok') {
                alert('File Uploaded')
                setIsLoading(false)
                setFileUploaded(true)
                setUploadClick(false)
            } else {
                alert("File couldn't be uploaded")
                setIsLoading(false)
                setMain(true)
            }
        }

        else {
            alert('Click Upload')
        }

    }

    async function handleDownload(e) {
        console.log(jsonFilePath)
        e.preventDefault()
        let filePath = ''
        let type = ''
        if (mappingType === 'json') {
            filePath = jsonFilePath
            type = 'json'
        } else if (mappingType === 'xml') {
            filePath = xmlFilePath
            type = 'xml'
        }

        await fetch('http://localhost:1337/api/downloadfile', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                filename: filePath,
                type: type
            })
        })
            .then(res => {
                res.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'output_' + filePath.slice(14);
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
                setItem(item)
                setCsvHeadersItem(item.csvheaders)
                setMappingType(item.mappingtype)
                console.log(item.csvheaders)
                console.log(item.mappingdata)
            }
        })
    }

    const handleUpload = async (e) => {
        e.preventDefault();

        const csvFormData = new FormData();
        if (csvFile) {
            csvFormData.append('name', 'csv_file');
            csvFormData.append('file', csvFile);


            console.log(...csvFormData)

            const csvResponse = await fetch('http://localhost:1337/api/uploadcsv', {
                method: 'POST',
                body: csvFormData
            })
            const csvData = await csvResponse.json()
            console.log(csvData.csvHeaders)
            setCsvHeaders(csvData.csvHeaders);
            setUploadClick(true)
        } else {
            alert('Upload CSV File')
        }
    }

    return (
        <div>
            <Navbar />
            <div class="w-full h-1/4 bg-no-repeat bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url(${bg})` }}>
                <div class="h-full  w-full  pt-10 px-20">

                    <p class="text-6xl text-gray-900 font-serif pt-10 px-20"> CSV Conversion</p>
                    <p class="px-36 text-6xl text-gray-900 font-serif "> Tool</p>
                    {main && <div>

                        <form onSubmit={uplaodFile}>
                            <div >
                                <div class="mt-32 ml-96 bg-black text-white  w-3/5 px-24 py-4 pt-6 "

                                    onDragOver={handleDrageOverCsv}
                                    onDrop={handleDropCsv}
                                >
                                    <h1 class="font-serif text-3xl py-6">Drag or browse new csv file upload CSV file</h1>
                                    {<input type="file" name="file" id="files" onChange={(e) => { setCsvFile(e.target.files[0]); setCsvFileName(e.target.files[0].name) }} />}
                                    {csvFile && <p class="px-">File Name: {csvFileName}</p>}
                                    <br />
                                    <button className="btnU" onClick={handleUpload}>Upload</button>
                                </div>
                                <div className="options">
                                    <select name="Mappings" id="mappings" value={optValue} onChange={setMapValues}>
                                        <option selected>--Select--</option>
                                        {
                                            mapData?.map(item => <option>{item.mappingname}</option>)
                                        }
                                    </select>
                                </div>
                                <input type="text" onChange={(e) => { setConversionName(e.target.value) }} placeholder="Conversion Name" className="input" style={{ width: '25%', margin: 'auto' }} />
                            </div>
                            <input type="submit" value="Convert" class="bg-black text-lg font-semibold  text-white px-4 py-2 mt-4 rounded-2xl justify-end ml-96 mb-1" />
                        </form>
                    </div>}
                    {isLoading && <div>Loading...</div>}
                    {fileUploaded && <div>
                        <form onSubmit={handleDownload}>
                            <button class="bg-black text-lg font-semibold  text-white px-4 py-2 rounded-2xl justify-end ml-96" type="submit" >Download</button>
                        </form>
                        <button class="bg-black text-lg font-semibold  text-white px-4 py-3 rounded-2xl justify-end ml-96" onClick={() => { setMain(true); setFileUploaded(false); setCsvFile('') }} >Upload Another</button>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default UseMap;