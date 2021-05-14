import React from 'react';
import { useSelector } from 'react-redux';
import { HoverDiv } from '../styled_components';
import { dataPresetsRedux, defaultTables } from '../config';
// This component handles and formats the map tooltip info. 
// The props passed to this component should contain an object of the hovered object (from deck, info.object by default)
export default function MapTooltipContent(){
    // destructure the object for cleaner formatting
    const tooltipContent = useSelector(state => state.tooltipContent);
    if (!tooltipContent.data) return <></>;

    const { cases, daily_cases, deaths, daily_deaths, name, population, testing_tcap, testing_wk_pos, vaccines_fully_vaccinated } = tooltipContent.data;
    try {
        return <HoverDiv style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: tooltipContent.x, top: tooltipContent.y}}>
            {name !== undefined && <>
                <h3>{name}</h3>
                <hr/>
            </>}
            {vaccines_fully_vaccinated !== undefined && <>
                Fully Vaccinated: {Math.round((vaccines_fully_vaccinated/population)*1000)/10}%
                <br/>
            </>}
            {/* {vaccines_one_dose && <>
                At Least One Dose: {Math.round((vaccines_one_dose[nIndex]/properties.population)*1000)/10}%<br/>
                Doses to be Administered per 100 People: {(Math.round((vaccines_dist[nIndex]/properties.population)*1000)/10)?.toLocaleString()}<br/>
            </>} */}
            {(cases >= 0 || cases < 0) && <>Cases: {cases.toLocaleString('en')}<br/></>}
            {(deaths >= 0 || deaths < 0) && <>Deaths: {deaths.toLocaleString('en')}<br/></>}
            {(daily_cases >= 0 || daily_cases < 0) && <>Daily New Cases: {daily_cases.toLocaleString('en')}<br/></>}
            {(daily_deaths >= 0 || daily_deaths < 0) && <>Daily New Deaths: {daily_deaths.toLocaleString('en')}<br/></>}
            <br/>
            {(testing_wk_pos >= 0 || testing_wk_pos < 0) && <>7-Day Positivity Rate: {testing_wk_pos.toLocaleString('en')}<br/></>}
            {(testing_tcap >= 0 || testing_tcap < 0) && <>7-Day Testing Capacity: {testing_tcap.toLocaleString('en')}<br/></>}
            
            {tooltipContent.data['Hospital Type'] && <>
                <h3>{tooltipContent.data['Name']}</h3>
                <hr />
                {tooltipContent.data['Hospital Type']}<br/>
                {tooltipContent.data.Address} <br />
                {tooltipContent.data.Address_2 && `${tooltipContent.data.Address_2}${<br/>}`}
                {tooltipContent.data.City}, {tooltipContent.data.State}<br/>
                {tooltipContent.data.Zipcode}<br/>
            </>}
            {tooltipContent.data.testing_status && <>
                <h3>{tooltipContent.data.name}</h3>
                <hr />
                {tooltipContent.data.address}<br/>
                {tooltipContent.data.city},{tooltipContent.data.st_abbr} <br />
                {tooltipContent.data.phone}<br/><br/>
                {tooltipContent.data.testing_status === 'Yes' ? 'This location offers COVID-19 testing.' : 'Currently, this location does not offer COVID-19 testing.'}<br/>
            </>}
            {'volume' in tooltipContent.data && <>
                <h3>{tooltipContent.data.name}</h3>
                {tooltipContent.data.type === 0 && <><b>Invited</b> vaccination clinic</>}
                {tooltipContent.data.type === 1 && <>Participating vaccination clinic</>}
                {tooltipContent.data.type === 3 && <>Large scale vaccination site</>}
                <hr />
                {tooltipContent.data.address}<br/>
                {tooltipContent.data.phone && <><br/>{tooltipContent.data.phone}<br/></>}
                {tooltipContent.data.volumne && <><br/><br/>Expected Vaccination Volume: {tooltipContent.data.volume}/day<br/><br/></>}
                {tooltipContent.data.description && <><br/>{tooltipContent.data.description}<br/><br/></>}
            </>}
            </HoverDiv>
    } catch {
        // todo: literally not this
        return null;
    }
}