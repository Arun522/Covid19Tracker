import React,{useState, useEffect} from 'react';
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import InfoBox from './InfoBox'
import './App.css'
import Map from './Map'
import Table from './Table'
import {SortData, prettyPrintStat} from './Util'
import LineGraph from './LineGraph'
import "leaflet/dist/leaflet.css"


const App = ()=> {

  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat: 34.80746,lng: -40.4796})
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesTypes, setCasesTypes] = useState("cases")

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then(data=>{
      setCountryInfo(data)
    })
  },[])

  useEffect(()=>{
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries = data.map((country)=>(
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ))
        const sortedData = SortData(data)
        setTableData(sortedData)
        setMapCountries(data)
        setCountries(countries)
      })
    }
    getCountriesData()
  },[countries])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value
    setCountry(countryCode)


    const url = countryCode === 'worldwide' 
      ? 'https://disease.sh/v3/covid-19/all' 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode)
      setCountryInfo(data)

      console.log("countryInfo",countryInfo)
      setMapCenter([data.countryInfo.lat, data.countryInfo.long ])
      setMapZoom(4)
    })
  }
  console.log(countryInfo)
  return (
    
      <div className="app">
        <div className="app__left">
          <div className="app__header">
            <h1>COVID-19 TRACKER</h1>
              <FormControl className="app__dropdown">
                <Select
                  variant="outlined"
                  value={country}
                  onChange={onCountryChange}
                >
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  {
                    countries.map(country => (
                      <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))
                  }
                {/* <MenuItem value="worldwide">worldwide</MenuItem>
                  <MenuItem value="worldwide">worldwide</MenuItem>
                  <MenuItem value="worldwide">worldwide</MenuItem>
                  <MenuItem value="worldwide">worldwide</MenuItem>*/}
                </Select>
              </FormControl>
          </div>
        
            <div className="app__stats">
              <InfoBox  
                  isRed
                  active={casesTypes === "cases"}
                  onClick={(e)=>setCasesTypes('cases')}
                  title="coronavirus cases" 
                  cases={prettyPrintStat(countryInfo.todayCases)} 
                  total={countryInfo.cases}
              />
              <InfoBox  
                  active={casesTypes === "recovered"}
                  onClick={(e)=>setCasesTypes('recovered')}
                  title="Recovered" 
                  cases={prettyPrintStat(countryInfo.todayRecovered)} 
                  total={countryInfo.recovered}
              />
              <InfoBox 
                  isRed
                  active={casesTypes === "deaths"}
                  onClick={(e)=>setCasesTypes('deaths')}
                  title="Deaths" 
                  cases={prettyPrintStat(countryInfo.todayDeaths)} 
                  total={countryInfo.deaths}
              />   
            </div>
            <Map
              casesTypes={casesTypes}
              countries={mapCountries}
              center={mapCenter}
              zoom={mapZoom}
            />

        </div>
        <Card className="app__right">
            <CardContent>
              <h3>Live  cases by country</h3>
              <Table countries={tableData}/>
              <h3 className="app__graphTitle">Worldwide new {casesTypes}</h3>
              <LineGraph 
                className="app__graph" 
                casesTypes={casesTypes} 
              />
            </CardContent>
        </Card>
      </div>


  )
}

export default App;
