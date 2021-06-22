import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Helper and Utility functions //
// first row: data loading
// second row: data parsing for specific outputs
// third row: data accessing
import { 
  getParseCSV, getParsePbf, mergeData, getColumns, loadJson,
  getDataForBins, getDataForCharts, getDataForLisa, getDateLists,
  getLisaValues, getCartogramValues, getDateIndices } from '../../utils'; //getVarId

// Actions -- Redux state manipulation following Flux architecture //
// first row: data storage
// second row: data and metadata handling 
// third row: map and variable parameters
import { 
  initialDataLoad, addTables, dataLoad, dataLoadExisting, storeLisaValues, storeCartogramData, setDates, setNotification,
  setMapParams, setUrlParams, setPanelState, updateMap } from '../../actions';

import { MapSection, NavBar, VariablePanel, Legend,  TopPanel, Preloader,
  DataPanel, MainLineChart, Scaleable, Draggable, InfoBox,
  NotificationBox, Popover, MapTooltipContent } from '../../components';  
  
import { HoverDiv } from '../../styled_components'; 

import { colorScales, fixedScales, dataPresets, defaultTables, dataPresetsRedux, variablePresets, colors } from '../../config';

import JsGeoDaWorker from '../../JsGeoDaWorker';

import useLoadData from '../../hooks/useLoadData';
import useUpdateData from '../../hooks/useUpdateData';

const gdaProxy = new JsGeoDaWorker();

// Main function, App. This function does 2 things:
// 1: App manages the majority of the side effects when the state changes.
//    This takes the form of React's UseEffect hook, which listens
//    for changes in the state and then performs the functions in the hook.
//    App listens for different state changes and then calculates the relevant
//    side effects (such as binning calculations and GeoDa functions, column parsing)
//    and then dispatches new data to the store.
// 2: App assembles all of the components together and sends Props down
//    (as of 12/1 only Preloader uses props and is a higher order component)

const getDefaultDimensions = () => ({
  defaultX: window.innerWidth <= 1024 ? window.innerWidth*.1 : window.innerWidth <= 1400 ? window.innerWidth-400 : window.innerWidth -500, 
  defaultXLong: window.innerWidth <= 1024 ? window.innerWidth*.1 : window.innerWidth <= 1400 ? window.innerWidth-450 : window.innerWidth -550,
  defaultY: window.innerWidth <= 1024 ? window.innerHeight*.25 : 75,
  defaultWidth: window.innerWidth <= 1024 ? window.innerWidth*.8 : 300,
  defaultWidthLong: window.innerWidth <= 1024 ? window.innerWidth*.8 : window.innerWidth <= 1400 ? 400 : 500,
  defaultHeight: window.innerWidth <= 1024 ? window.innerHeight*.4 : 300,
  defaultHeightManual: window.innerWidth <= 1024 ? window.innerHeight*.7 : window.innerHeight*.5,
  defaultWidthManual: window.innerWidth <= 1024 ? window.innerWidth*.5 : window.innerWidth*.35,
  defaultXManual: window.innerWidth <= 1024 ? window.innerWidth*.25 : window.innerWidth*.25,
  defaultYManual: window.innerWidth <= 1024 ? window.innerHeight*.15 : window.innerHeight*.325,
  minHeight: window.innerWidth <= 1024 ? window.innerHeight*.5 : 200,
  minWidth: window.innerWidth <= 1024 ? window.innerWidth*.5 : 200,
})

const dateLists = getDateLists()

export default function Map() {

  // These selectors access different pieces of the store. While App mainly
  // dispatches to the store, we need checks to make sure side effects
  // are OK to trigger. Issues arise with missing data, columns, etc.
  const mapParams = useSelector(state => state.mapParams);
  const dataNote = useSelector(state => state.dataParams.dataNote);
  const fixedScale = useSelector(state => state.dataParams.fixedScale);
  const variableName = useSelector(state => state.dataParams.variableName);
  const panelState = useSelector(state => state.panelState);
  const mapLoaded = useSelector(state => state.mapLoaded);
  const isLoading = useSelector(state => state.isLoading);
  // const fullState = useSelector(state => state);

  const dispatch = useDispatch(); 

  // gdaProxy is the WebGeoda proxy class. Generally, having a non-serializable
  // data in the state is poor for performance, but the App component state only
  // contains gdaProxy.
  const [defaultDimensions, setDefaultDimensions] = useState({...getDefaultDimensions()})
  const [firstLoad, secondLoad, lazyFetchData] = useLoadData(gdaProxy)
  const [] = useUpdateData(gdaProxy)

  // // Dispatch helper functions for side effects and data handling
  // Get centroid data for cartogram
  // const getCentroids = (geojson, gdaProxy) =>  dispatch(setCentroids(gdaProxy.GetCentroids(geojson), geojson))

  // After runtime is initialized, this loads in gdaProxy to the state
  useEffect(() => {
    let paramsDict = {}; 
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams ) { paramsDict[key] = value; }

    if (!paramsDict.hasOwnProperty('v')) {
      // do nothing, most of the time
    } else if (paramsDict['v'] === '2') {
      dispatch(
        setUrlParams(paramsDict, variablePresets)
      );
    } else if (paramsDict['v'] === '1') {
      dispatch(setNotification(`
          <h2>Welcome to the Atlas v2!</h2>
          <p>
          The share link you have entered is for an earlier release of the US Covid Atlas. 
          Explore the new version here, or continue using your current share link by click below.
          <a href="./vintage/map.html${window.location.search}" target="_blank" rel="noopener noreferrer" style="color:${colors.yellow}; text-align:center;">
            <h3 style="text-align:center">
              US Covid Atlas v1
            </h3>  
          </a>
          </p>
        `,
        'center'))
    }

    if (window.innerWidth <= 1024) {
      dispatch(setPanelState({
        variables:false,
        info:false,
        tutorial:false,
        lineChart: false
      }))
    }

    dispatch(setDates(dateLists.isoDateList))
  },[])  

  // default width handlers on resize
  useEffect(() => {
    setDefaultDimensions({...getDefaultDimensions()})
  }, [window.innerHeight, window.innerWidth])

  return (
    <div className="Map-App" style={{overflow:'hidden'}}>
      <Preloader loaded={mapLoaded} />
      <NavBar />
      {isLoading && <div id="loadingIcon" style={{backgroundImage: `url('${process.env.PUBLIC_URL}assets/img/bw_preloader.gif')`}}></div>}
      {/* <header className="App-header" style={{position:'fixed', left: '20vw', top:'100px', zIndex:10}}>
        <button onClick={() => console.log(fullState)}>Log state</button>
      </header> */}
      <div id="mainContainer" className={isLoading ? 'loading' : ''}>
        <MapSection />
        <TopPanel />
        <Legend 
          variableName={variableName} 
          colorScale={mapParams.colorScale}
          bins={mapParams.bins.bins}
          fixedScale={fixedScale}
          resource={mapParams.resource}
          note={dataNote}
          />
        <VariablePanel />
        <DataPanel />
        <Popover /> 
        <NotificationBox />  
        {panelState.lineChart && <Draggable 
          z={9}
          defaultX={defaultDimensions.defaultXLong}
          defaultY={defaultDimensions.defaultY}
          title="lineChart"
          content={
          <Scaleable 
            content={
              <MainLineChart />
            } 
            title="lineChart"
            defaultWidth={defaultDimensions.defaultWidthLong}
            defaultHeight={defaultDimensions.defaultHeight}
            minHeight={defaultDimensions.minHeight}
            minWidth={defaultDimensions.minWidth} />
        }/>} 
        {panelState.tutorial && <Draggable 
          z={10}
          defaultX={defaultDimensions.defaultXManual}
          defaultY={defaultDimensions.defaultYManual}
          title="tutorial"
          content={
          <Scaleable 
            content={
              <InfoBox />
            } 
            title="tutorial"
            defaultWidth={defaultDimensions.defaultWidthManual}
            defaultHeight={defaultDimensions.defaultHeightManual}
            minHeight={defaultDimensions.minHeight}
            minWidth={defaultDimensions.minWidth} />
        }/>}
        <MapTooltipContent />

      </div>
    </div>
  );
}