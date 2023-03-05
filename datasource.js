import axios from 'axios';
import xml2js from 'xml2js';
import fs from 'fs';
import { convertMetarChildObjectToArray, convertChildObjectToArray, sortByClosest } from './utility.js';

async function getMetarData(id) {
    const xml = await axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${id}&hoursBeforeNow=2`);
    const json = await xml2js.parseStringPromise(xml.data, { explicitArray: false, mergeAttrs: true });
    let result = [];
    if (json.response.data.num_results === '0') {
        console.log('This will be a 404');
    } else if (Array.isArray(json.response.data.METAR)) {
        result = json.response.data.METAR;
    } else {
        result.push(json.response.data.METAR);
    }
    let metarArray = convertMetarChildObjectToArray(result);
    return metarArray;
}

async function getTafData(id) {
    const xml = await axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=${id}&hoursBeforeNow=4`);
    const jsonObj = await xml2js.parseStringPromise(xml.data, { explicitArray: false, mergeAttrs: true });
    const json = convertChildObjectToArray(jsonObj.response.data);
    return json;
}

async function getReportingStationsData(lat, long, limit) {
    const data = await fs.promises.readFile('metarlist.json', 'utf8');
    const raw_stations = JSON.parse(data);
    const stations = sortByClosest(raw_stations, {
        latitude: lat,
        longitude: long
    }).splice(0, limit);
    return stations;
}

async function getAllReportingStationsData() {
    const data = await fs.promises.readFile('metarlist.json', 'utf8');
    const stations = JSON.parse(data);
    return stations;
}

export { getMetarData, getTafData, getReportingStationsData, getAllReportingStationsData };