// Library import
import React, {useState, useRef, useContext} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { GeoDaContext } from '../contexts/GeoDaContext';

import { setPanelState } from '../actions'

import Select from '@material-ui/core/Select';

// Config/component import
import { colors } from '../config';
import { prop } from 'ramda';

const DataLoaderContainer = styled.div`
    z-index:50;
    position:fixed;
    width:100vw;
    height:100%;
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`
const Shade = styled.button`
    position:absolute;
    left:0;
    top:0;
    width:100vw;
    height:100%;
    background:rgba(0,0,0,0.75);
    border:none;
    z-index:0;
    cursor:pointer;
`

const Modal = styled.div`
    display:block;
    background:${colors.gray};
    box-shadow: 0px 0px 5px rgba(0,0,0,0.7);
    border-radius: 1em;
    z-index:1;
    padding:1rem;
    color:white;
    margin:auto;
    input[type=submit]{
        padding:0.5em;
        border:1px solid ${colors.yellow};
        background: ${colors.gray};
        color: ${colors.yellow};
        cursor:pointer;
        margin:0.5em;
        transition:250ms all;
        &:hover {
            background: ${colors.yellow};
            color: ${colors.darkgray};
        }
    }
    
    input[type=file], input[type=text] {
        color:white;
        border-color:white;
        padding-bottom:0.5em;
        background:${colors.gray};
        border-bottom:1px solid ${colors.white};
    }
    input[type=text] {
        padding:0.5em;
    }
    a {
        color:${colors.yellow};
    }
    transition:250ms all;
`

const HelperText = styled.p`
    font-size:0.75rem;
`

const FormButton = styled.button`
    padding:0.5em;
    border:1px solid ${colors.white};
    background: ${props => props.active ? colors.white : colors.gray};
    color: ${props => props.active ? colors.gray : colors.white};
    cursor:pointer;
    margin:0.5em 0.5em 0.5em 0;
    
`

const MessageText = styled.p`
    color: ${props => props.type === 'error' ? colors.red : colors.lightblue};
    padding:0.5em;
`

const FileForm = styled.form`
    opacity: ${props => props.complete ? 0.5 : 1};
    transition:250ms all;
    transition-delay:3s all;
`

const FileUploader = ({onFileSelectSuccess, onFileSelectError}) => {
    const fileInput = useRef(null)

    const handleFileInput = (e) => {
        // handle validations
        const file = e.target.files[0];
        if (!file.name.includes('json')){
            onFileSelectError({ error: "File must be GeoJSON." });
        } else {
            onFileSelectSuccess(file);
        }
      };

    return <input type="file" onChange={handleFileInput} />
}

const validateGeojson = (content) => {
    if (content.crs?.properties?.name && !content.crs.properties.name.includes('CRS84') ){
        return ['Geospatial data must be in WGS84 projection.', false]
    }
    if (content.features === undefined || !content.features.length){
        return ['No features detected.', false]
    }

    return [false, true]
}

// DataLoader component
export default function DataLoader(){
    const dispatch = useDispatch()
    const customData = useSelector(state => state.customData);

    const [uploadTab, setUploadTab] = useState(true);
    const [selectedFile, setSelectedFile] = useState('');
    const [fileMessage, setFileMessage] = useState(false);
    const [idMessage, setIdMessage] = useState(false);

    const [currentGeojson, setCurrentGeojson] = useState({});
    const geoda = useContext(GeoDaContext);

    const closePanel = () => dispatch(setPanelState({dataLoader: false}))

    let fileReader;
    
    const loadArrayBuffer = async (content) => {
        const enc = new TextEncoder()
        const ab = enc.encode(JSON.stringify(content))
        const mapId = await geoda.readGeoJSON(ab)
        setCurrentGeojson(prev => { return {
            ...prev,
            mapId
        }})
    }

    const handleFileRead = () => {
        const content = JSON.parse(fileReader.result);
        const [error, validGeojson] = validateGeojson(content)
        if (validGeojson) {
            setCurrentGeojson({
                data: {...content},
                columns: Object.keys(content.features[0].properties)
            })

            setFileMessage({
                type: 'validation',
                body:`Basic validation complete. Please select define your variables.`
            });

            loadArrayBuffer(content)

        } else {
            setFileMessage({
                type: 'error',
                body:`Error! GeoJSON is invalid: ${error}`
            })
        }
    }
    const handleFileSubmission = (e) => {
        e.preventDefault();
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(selectedFile)
    }

    const handleUploadTab = (e) => {
        e.preventDefault();
        setUploadTab(e.target.getAttribute('data-id') === 'file-upload');
    }

    const handleIdColumnSelect = () => {}
    return (
        <DataLoaderContainer>
            <Modal>
                <h2>Data Loader</h2>
                <br/>
                <hr/>
                <br/>
                <FileForm complete={undefined !== currentGeojson.mapId} onSubmit={handleFileSubmission}>

                    <label for="filename">{uploadTab ? 'Select your GeoJSON for Upload' : 'Enter a valid GeoJSON URL'}</label>
                    <HelperText>For more information on formatting your data, click <a href="#">here</a></HelperText>

                    <br/>
                    <FormButton onClick={handleUploadTab} data-id={"file-upload"} active={uploadTab}>File Upload</FormButton> 
                    <FormButton onClick={handleUploadTab} data-id={"file-link"} active={!uploadTab}>File Link</FormButton>

                    <br/>
                    
                    {uploadTab && <FileUploader
                        onFileSelectSuccess={(file) => {
                            setFileMessage(false)
                            setSelectedFile(file)
                        }}
                        onFileSelectError={({ error }) => setFileMessage({
                            type:'error',
                            body: error
                        })}

                        />}
                    {!uploadTab && <input type="text" name="filename" placeholder="eg https://raw.githubusercontent.com/..."/>}
                    <input type="submit"/>
                    {fileMessage && <MessageText type={fileMessage.type}>{fileMessage.body}</MessageText>}
                </FileForm>

                {currentGeojson.columns && 
                <FileForm complete={undefined !== currentGeojson.idColumn} onSubmit={handleIdColumnSelect}>
                    <label for="idcolumn">Select your data's ID column</label>
                    <HelperText>For more information on formatting your data, click <a href="#">here</a></HelperText>
                    {currentGeojson.columns.map(col => <p>{col}</p>)}
                     <input type="submit"/>
                    {idMessage && <MessageText type={idMessage.type}>{idMessage.body}</MessageText>}
                </FileForm>
                }
            </Modal>
            <Shade 
                aria-label="Exit Data Loader"
                onClick={closePanel}
                ></Shade>
        </DataLoaderContainer>
    )
}