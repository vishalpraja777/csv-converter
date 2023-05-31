import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import './main.css';
import bg from './images/bg.webp'


const EditMapping = () => {

    const [mapData, setMapData] = useState()
    const [itemMapData, setItemMapData] = useState()

    const [tableView, setTableView] = useState(true)
    const [editView, setEditView] = useState(false)

    const [jsonType, setJsonType] = useState(true)
    const [xmlType, setXmlType] = useState(false)

    const [csvFile, setCsvFile] = useState('')
    const [csvFileName, setCsvFileName] = useState('')

    // JSON Fields
    const [jsonFile, setJsonFile] = useState('')
    const [jsonFileName, setJsonFileName] = useState('')

    const [csvHeaders, setCsvHeaders] = useState([]);
    const [jsonHeaders, setJsonHeaders] = useState([]);
    const [xmlHeaders, setxmlHeaders] = useState([]);

    const [isUploaded, setIsUploaded] = useState(false);

    const [mappings, setMappings] = useState(new Map());
    const [mapName, setMapName] = useState('');

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

    const handleEdit = (e, item) => {
        console.log(item)
        setItemMapData(item)
        setTableView(false)
        setEditView(true)

        // if (item.mappingtype === 'json') {
        //     setJsonType(true)
        //     setXmlType(false)
        //     setJsonHeaders()
        // } else if (item.mappingtype === 'xml') {
        //     setXmlType(true)
        //     setJsonType(false)
        //     setJsonHeaders()
        // }

        setJsonHeaders(item.jsonxmlheaders)

        setCsvHeaders(item.csvheaders)
        const mappings = new Map(Object.entries(item.mappingdata));
        setMappings(mappings)
    }

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

    const saveEdit = async () => {
        console.log('Clicked')

        const mapping = {}
        for (let [key, value] of mappings) {
            mapping[key] = value;
        }

        const response = await fetch('http://localhost:1337/api/updatemapping', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: itemMapData._id,
                mappingData: mapping,
            })
        })
        
        const data = await response.json();

        console.log(data)

        if(data.status === 'ok') {
            alert('Mapping Updated')
            window.location.reload()
        } else {
            alert("Couldn't update mapping")
        }
        setTableView(true)
        setEditView(false)

    }

    const cancelEdit = () => {
        setTableView(true)
        setEditView(false)
    }

    return (
        <div className="w-full h-1/4 bg-no-repeat bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bg})` }}>
            <Navbar />
            <div class="h-full  w-full   text-gray-900 font-serif  px-20">
                    <p class="text-6xl text-gray-900 font-serif pt-28 px-20"> CSV Conversion</p>
                    <p class="px-36 text-6xl text-gray-900 font-serif "> Tool</p>
                    {tableView && <div class = "py-44">
                    <table class = " ml-96  ">
                    <tr class = "font-bold text-2xl">
                        <th>Map Name</th>
                        <th>Map Type</th>
                        <th>Edit</th>
                    </tr>
                    {
                        mapData?.map((item) =>
                            <tr class = "font-semibold text-lg">
                                <td>{item.mappingname}</td>
                                <td>{item.mappingtype.toUpperCase()}</td>
                                <td><button class="  bg-black text-white  font-semibold mr-10 text-lg p-3 rounded-xl ml-2 hover:bg-gray-400 active:bg-slate-200" onClick={(e) => handleEdit(e, item)}>Edit</button></td>
                            </tr>
                        )
                    }
                </table>
            </div>}
            </div>
            {editView && <div>
                <div className="flex space-x-64 px-44 mt-16  mr-18">
                    {jsonType && <div>
                        <h1 class = "font-bold underline mb-4 text-lg">JSON/XML_Headers</h1>
                        {
                            jsonHeaders?.map((header) => (
                                <div>
                                    <div
                                        className="dragDiv"
                                        onDragOver={handleDragOverMap}
                                        onDrop={(e) => { handleDropMap(e, header) }}
                                    >
                                        <div className="p-1 bg-black text-white rounded-xl">{header}</div>
                                        <div style={{ marginLeft: "20px" }}>=&gt;</div>
                                        <div className="p-1 bg-black text-white rounded-xl">{mappings.get(header)}</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>}
                    <div>
                        <h1 class = "font-bold underline mb-4 text-lg">CSV_Headers</h1>
                        {
                            csvHeaders.map((header) => (
                                <div
                                    // className="jsonItem1"
                                    draggable
                                    onDragStart={(e) => { handleOnDragStart(e, header) }}
                                >
                                    <div className="p-1 bg-black text-white rounded-xl">{header}</div>
                                    <br />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <button className="btnU bg-black text-white ml-96  font-semibold mr-10 text-xl  flex p-3 rounded-3xl hover:bg-gray-400 active:bg-slate-200" onClick={saveEdit}>Save Edit</button>
                <button className="btnU bg-black text-white ml-96  font-semibold mr-10 text-xl  flex p-3 rounded-3xl hover:bg-gray-400 active:bg-slate-200" onClick={cancelEdit}>Cancel Edit</button>
            </div>}
            </div>
    );
}

export default EditMapping;