import fs from 'fs';

const metardata = await fs.promises.readFile('metarlist.txt', 'utf8');
let metarobject = [];

const lines = metardata.split('\n');

lines.forEach((line, index) => {
    if (index > 0) {
        const regoin = line.substring(0, 2);
        //console.log(regoin);
        // 3 - 19 Name
        const airport = line.substring(3, 9);
        //console.log(airport.toLocaleLowerCase());
        // 20 - 24 ICAO Idenifier
        const identifier = line.substring(20, 24);
        //console.log(identifier);
        // 39 - 45 LAT
        const lat = line.substring(39, 45);
        //console.log(convertLatNLongIntoGeocode(lat));
        // 47 - 54 LONG
        const long = line.substring(47, 54);
        //console.log(convertLatNLongIntoGeocode(long));
        // 55 - 59 Elevation
        const elevation = line.substring(55, 59);
        //console.log(elevation.trim());
        // 81 - 83 Country Code
        const country_code = line.substring(81, 83);
        //console.log(country_code);
        //console.log('');
        const object = {
            "region": regoin,
            "city": formatName(airport),
            "identifier": identifier,
            "lat": convertLatNLongIntoGeocode(lat),
            "long": convertLatNLongIntoGeocode(long),
            "elevation": elevation.trim(),
            "country_code": country_code
        };
        metarobject.push(object);
    }
})

await fs.promises.writeFile('metarlist.json', JSON.stringify(metarobject), 'utf8');

function convertLatNLongIntoGeocode(position) {
    const direction = position.substring(position.length - 1);
    let geocode;
    switch (direction) {
        case 'W':
        case 'S':
            geocode = `-${position.substring(0, position.length - 1).replace(' ', '.')}`;
            break;
        case 'N':
        case 'E':
            geocode = `${position.substring(0, position.length - 1).replace(' ', '.')}`;
    }
    return geocode;
}

function formatName(name) {
    return `${name.substring(0, 1).toLocaleUpperCase()}${name.substring(1, name.length - 1).toLocaleLowerCase()}`.trim();
}