import dataFn from './dataFunction';
// this function loops through the current data set and provides data for GeodaJS to create custom breaks 
const getDataForBins = (numeratorData, denominatorData, dataParams) => {
    const { nProperty, nIndex, dType, dIndex} = dataParams;

    // declare empty array for return variables
    let rtn = new Array(numeratorData.length);

    // length of data table to loop through
    const keys = Object.keys(numeratorData);
    const n = keys.length;

    // this checks if the bins generated should be dynamic (generating for each date) or fixed (to the most recent date)
    if (nIndex === null && nProperty === null) {
        // if fixed, get the most recent date
        let tempIndex = numeratorData.length-1;
        // if the denominator is time series data (eg. deaths / cases this week), make the indices the same (most recent)
        let tempDIndex = dType === 'time-series' ? denominatorData.length-1 : dIndex;
        // loop through, do appropriate calculation. add returned value to rtn array
        for (let i=0; i<n; i++){
            rtn[keys[i]] = dataFn(numeratorData[keys[i]], denominatorData[keys[i]], {...dataParams, nIndex:tempIndex, dIndex: tempDIndex})||0
        }
    } else {
        for (let i=0; i<n; i++){
            rtn[i] = dataFn(numeratorData[keys[i]], denominatorData[keys[i]], dataParams)||0
        }
    }

    for (let i=0; i<rtn.length;i++){
        if (rtn[i] < 0) rtn[i] = 0
    }

    return rtn;   
}
export default getDataForBins