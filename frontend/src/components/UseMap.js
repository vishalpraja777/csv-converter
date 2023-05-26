import React from "react";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
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

    useEffect(() => {
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

    const navigate = useNavigate();

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

        setIsLoading(true);
        setMain(false);

        // const files = document.getElementById("files");

        // setCsvFile(files.files[0])
        // setFileName(files.files[0].name)

        // console.log(document.querySelector("#files"))
        // setCsvFile(event.target.files);
        // setCsvFile(document.querySelector("#files"));
        // console.log(csvFile)

        if (!csvFileName.endsWith(".csv")) {
            alert("Please Upload a valid CSV file")
            window.location.reload()
            return
        }

        const csvFormData = new FormData();
        if (csvFile) {
            csvFormData.append('name', 'csv_file');
            // formData.append('file', files.files[0]);
            csvFormData.append('file', csvFile);


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

            console.log(csvData)

            if (csvData.status === 'ok') {
                alert('File Uploaded')
                setIsLoading(false)
                setFileUploaded(true)
            } else {
                alert("File couldn't be uploaded")
            }
        }

        else {
            alert('Click Upload')
        }

    }

    async function handleDownload(e) {
        e.preventDefault()
        const res = await fetch('http://localhost:1337/api/downloadjson')
            .then(res => {
                res.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'output.json';
                    a.click();
                });
            });

        alert('File Downloaded')

        //  setFileUploaded(false)
        //  setMain(true)
        //  setCsvFile('')

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
                        <div class = "mt-32 ml-96 bg-black text-white  w-3/5 px-24 py-4 pt-6 "
                            
                            onDragOver={handleDrageOverCsv}
                            onDrop={handleDropCsv}
                        >
                            <h1 class = "font-serif text-3xl py-6">Drag or browse new csv file upload CSV file</h1>
                            {<input type="file" name="file" id="files" onChange={(e) => { setCsvFile(e.target.files[0]); setCsvFileName(e.target.files[0].name) }} />}
                            {csvFile && <p class = "px-">File Name: {csvFileName}</p>}
                            <br />
                        </div>
                        <div class = " ml-96 bg-black text-white  w-3/5 px-28 py-8 ">
                            <select name="Mappings" id="mappings" value={optValue} onChange={(e) => { setOptValue(e.target.value);console.log(e.target.value) }}>
                                {
                                    mapData?.map(item => <option>{item.mappingname}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <input type="submit" value="Upload" class= "bg-black text-lg font-semibold  text-white px-4 py-2 mt-4 rounded-2xl justify-end ml-96 mb-1"  />
                </form>
            </div>}
            {isLoading && <div>Loading...</div>}
            {fileUploaded && <div>
                <form onSubmit={handleDownload}>
                    <button class= "bg-black text-lg font-semibold  text-white px-4 py-2 rounded-2xl justify-end ml-96" type="submit" >Download</button>
                </form>
                <button class= "bg-black text-lg font-semibold  text-white px-4 py-3 rounded-2xl justify-end ml-96" onClick={() => { setMain(true); setFileUploaded(false); setCsvFile('') }} >Upload Another</button>
            </div>}
        </div>
        </div>
        </div>
    );
}

export default UseMap;