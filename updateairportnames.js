import fs from 'fs';

const airportdata = await fs.promises.readFile('airports.dat', 'utf8');
const airportlines = airportdata.split('\n');
const airports = airportlines.map(line => {
    const lineparts = line.split(',');
    if (lineparts[1] !== undefined && lineparts[5] !== undefined) {
        return {
            "name": lineparts[1].replace(/['"]+/g, ''),
            "identifier": lineparts[5].replace(/['"]+/g, '')
        };
    } else {
        return {
            "name": "unknown",
            "identifier": "uknwn"
        };
    }
});
const airportMap = airports.reduce((map, obj) => {
    map[obj.identifier] = obj.name;
    return map;
}, {});

const reportingdata = await fs.promises.readFile('metarlist.json', 'utf8');
const reportingstations = JSON.parse(reportingdata);

const correctedReportingStations = reportingstations.map(station => {
    return {
        region: station.region,
        station: airportMap[station.identifier] ?? station.station,
        identifier: station.identifier,
        lat: station.lat,
        long: station.long,
        elevation: station.elevation,
        country_code: station.country_code
    }
}).filter(item => item.identifier !== '    ');

await fs.promises.writeFile('metarlist.json', JSON.stringify(correctedReportingStations), 'utf8');
