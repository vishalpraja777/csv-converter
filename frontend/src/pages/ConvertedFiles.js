import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const ConvertedFiles = () => {

    const [conversionData, setConversionData] = useState()

    useEffect(() => {
        console.log(localStorage.getItem('userid'))
        fetch(`http://localhost:1337/api/getconversiondata/${localStorage.getItem('userid')}`)
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
                    setConversionData(jsonData)
                });
            })
        console.log(conversionData)
    }, [])

    const handleDownload = async (e, filename, type) => {
        e.preventDefault()

        const response = await fetch('http://localhost:1337/api/downloadjson', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                filename: filename,
                type: type
            })
        })

        // const data = await response.json();

        if ( type === 'json') {
            response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download ='output_' + filename.slice(14);
                a.click();
            });
        } else if( type === 'csv') {
            response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = 'output_' + filename.slice(14);
                a.click();
            });
        }
        else{
            alert('File not downloaded')
        }

        // if (data.status === 'ok') {
        //     console.log(data.status)
        // } else {
        //     console.log(data.error)
        // }

        // console.log(data)
        console.log(filename)
        console.log(type)
    }

    return (
        <div>
            <Navbar />
            <div>
                <table>
                    <tr>
                        <th>Conversion Name</th>
                        <th>Mapping Name</th>
                        <th>CSV File</th>
                        <th>Json File</th>
                    </tr>
                    {
                        conversionData?.map((item) =>
                            <tr>
                                <td>{item.conversionname}</td>
                                <td>{item.mappingname}</td>
                                <td>{item.csvfile.slice(14)} <button onClick={(e) => handleDownload(e, item.csvfile, 'csv')}>Download</button></td>
                                <td>{item.jsonfile.slice(14)} <button onClick={(e) => handleDownload(e, item.jsonfile, 'json')}>Download</button></td>
                            </tr>
                        )
                    }
                </table>
            </div>
        </div>
    );
}

export default ConvertedFiles;