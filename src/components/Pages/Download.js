import React from 'react';
import styled from 'styled-components';
// import { NavLink } from 'react-router-dom';
import { ContentContainer, Gutter } from '../../styled_components';
import { NavBar, Footer, CsvDownloader } from '../'; 

const DownloadPage = styled.div`
    background:white;
`
 
export default function Downloader(){
    return (
       <DownloadPage>
            <NavBar light/>
            <ContentContainer>
                <h1>Data Download</h1>
                <Gutter h={10}/>
                <p>
                    Use the form below to download the most recent data available. 
                    Documentation describing the data will be included in the ZIP archive.
                </p>
                <Gutter h={10}/>
                <p>
                    For further data and statistics available from the US COVID Atlas,
                    please see our <a href="/api">API</a> page for further information.
                </p>
                <Gutter h={10}/>
                <CsvDownloader/>
               
            </ContentContainer>
            <Footer/>
       </DownloadPage>
    );
}