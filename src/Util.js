import React from 'react'
import {Circle, Popup} from 'react-leaflet'
import numeral from 'numeral'

const casesTypesColors = {
    cases: {
        hex:"#CC1034",
        multiplier: 800
    },
    recovered: {
        hex:"#7dd71d",
        multiplier:1200
    },
    deaths: {
        hex:"#fb4443",
        multiplier:2000
    }
}

export const SortData = (data) => {
    const sortedData = [...data]

    sortedData.sort((a, b)=>{
        if(a.cases>b.cases){
            return -1
        }else{
            return 1
        }
    })
    return sortedData
}
//draw circle on the map
export const showDataOnMap = (data, casesTypes='cases') => (
    data.map((country) => (
        <Circle 
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypesColors[casesTypes].hex}
            fillColor={casesTypesColors[casesTypes].hex}
            radius={
                Math.sqrt(country[casesTypes]) * casesTypesColors[casesTypes].multiplier
            }
        >
            <Popup>
                <div>
                    <div 
                    className="info-flag"
                    style={{backgroundImage: `url(${country.countryInfo.flag})`}}
                    />
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">Recovered: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-deaths">Deaths: {numeral(country.cases).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))

)

export const prettyPrintStat = (stat) => (
    stat ? `+${numeral(stat).format("0.0a")}` : "+0"
    
)