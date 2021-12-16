import React from 'react';
import { useSelector } from 'react-redux';
import { useDataStore } from '../contexts/Data';
import dataDateRanges from "../config/dataDateRanges";

export default function useCurrentDateIndices() {
    const [{ storedData }] = useDataStore();    
    const nIndex = useSelector((state) => state.dataParams.nIndex);
    const dIndex = useSelector((state) => state.dataParams.dIndex);
    const dates = useSelector((state) => state.dates);
    const currentTable = useSelector((state) => state.currentTable);
    const currDates = storedData[currentTable?.numerator?.name?.split('.')[0]]?.dates;
    const currDatesAvailable = dataDateRanges[currentTable?.numerator?.name?.split('.')[0]];
    const currentIndex = (nIndex||dIndex) === null 
        ? currDatesAvailable?.slice(-1)[0] || dates.length-1
        : (nIndex||dIndex)
    return [
        currentIndex||1,
        currDates||[],
        currDatesAvailable||[],
        dates||[],
    ]
}