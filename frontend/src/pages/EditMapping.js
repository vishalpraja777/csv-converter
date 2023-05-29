import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";


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
        <div>
            <Navbar />
            {tableView && <div>
                <table>
                    <tr>
                        <th>Map Name</th>
                        <th>Map Type</th>
                        <th>Edit</th>
                    </tr>
                    {
                        mapData?.map((item) =>
                            <tr>
                                <td>{item.mappingname}</td>
                                <td>{item.mappingtype.toUpperCase()}</td>
                                <td><button onClick={(e) => handleEdit(e, item)}>Edit</button></td>
                            </tr>
                        )
                    }
                </table>
            </div>}
            {editView && <div>
                <div className="mappingContent">
                    {jsonType && <div className="jsonContent">
                        <h1>JSON/XML Headers</h1>
                        {
                            jsonHeaders?.map((header) => (
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

                    {/*xmlType && <div className="csvContent">
                        <h1>XML Headers</h1>
                        {
                            jsonHeaders?.map((header) => (
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
                    </div>*/}

                    <div className="csvContent">
                        <h1>CSV Headers</h1>
                        {
                            csvHeaders.map((header) => (
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
                    </div>
                </div>
                <button className="btnU" onClick={saveEdit}>Save Edit</button>
                <button className="btnU" onClick={cancelEdit}>Cancel Edit</button>
            </div>}
        </div>
    );
}

export default EditMapping;