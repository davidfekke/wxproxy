import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import mercurius from 'mercurius';
import axios from 'axios';
import xml2js from 'xml2js';
import fs from 'fs';

// Define your GraphQL schema
const schema = `
  type Metar {
    raw_text: String!
    station_id: String
    observation_time: String!
    latitude: Float!
    longitude: Float!
    temp_c: Float!
    dewpoint_c: Float!
    wind_dir_degrees: Int!
    wind_speed_kt: Float!
    visibility_statute_mi: Float
    altim_in_hg: Float!
    sea_level_pressure_mb: Float
    flight_category: String
    sky_condition: [SkyCondition!]!
  }

  type Taf {
    raw_text: String!
    station_id: String!
    issue_time: String!
    bulletin_time: String!
    valid_time_from: String!
    valid_time_to: String!
    latitude: Float!
    longitude: Float!
    elevation_m: Float!
    forecast: [Forecast!]!
  }

  type Forecast {
    fcst_time_from: String!
    fcst_time_to: String!
    change_indicator: String!
    wind_dir_degrees: Int
    wind_speed_kt: Int
    visibility_statute_mi: Float
    wx_string: String
    sky_condition: [SkyCondition!]
  }

  type SkyCondition {
    sky_cover: String!
    cloud_base_ft_agl: Int
  }

  type ReportingStations {
    region: String!
    station: String!
    identifier: String!
    lat: Float!
    long: Float!
    elevation: Int!
    country_code: String!
  }

  type Query {
    add(x: Int, y: Int): Int
    getMetar(id: String!): [Metar!]!
    getTaf(id: String!): [Taf!]!
    getReportingStations(lat: Float!, long: Float!, limit: Int!): [ReportingStations!]!
  }
`

const resolvers = {
  Query: {
    add: async (_, { x, y }) => {
        return x + y;
    },
    getMetar: async (_, { id }) => {
        const xml = await axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${id}&hoursBeforeNow=2`);
        const json = await xml2js.parseStringPromise(xml.data, { explicitArray: false, mergeAttrs: true });
        let result = [];
        if (Array.isArray(json.response.data.METAR)) {
            result = json.response.data.METAR;
        } else {
            result.push(json.response.data.METAR);
        }
        let metarArray = convertMetarChildObjectToArray(result);
        return metarArray;
    },
    getTaf: async (_, { id }) => {
        const xml = await axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=${id}&hoursBeforeNow=4`);
        const jsonObj = await xml2js.parseStringPromise(xml.data, { explicitArray: false, mergeAttrs: true });
        const json = convertChildObjectToArray(jsonObj.response.data);
        return json;
    },
    getReportingStations: async (_, { lat, long, limit }) => {
        const data = await fs.promises.readFile('metarlist.json', 'utf8');
        const raw_stations = JSON.parse(data);
        const stations = sortByClosest(raw_stations, {
            latitude: lat,
            longitude: long
        }).splice(0, limit);
        return stations;
    }
  }
}

// Create an instance of ApolloServer


const fastify = Fastify({ logger: true });

const port = process.env.PORT || '3000';

fastify.register(mercurius, {
    schema,
    resolvers,
    graphiql: true
})

fastify.register(fastifyCors, { 
    // put your options here
});

//fastify.register(parser);

let parseroptions = {
    parseNodeValue: true,
    parseAttributeValue: true
}

function convertChildObjectToArray(jsonObj) {
    const tafArray = jsonObj.TAF;
    for (let taf of tafArray) {
        for (let forecast of taf.forecast) {
            if (!Array.isArray(forecast.sky_condition)) {
                forecast.sky_condition = [forecast.sky_condition];
            }
        }
    }
    return tafArray; 
}

function convertMetarChildObjectToArray(result) {
    const metarArray = result;
    for (let metar of metarArray) {
        if (!Array.isArray(metar.sky_condition)) {
            metar.sky_condition = [metar.sky_condition];
        }
    }
    return metarArray; 
}

fastify.get('/', async function (req, reply) {
    const query = '{ add(x: 2, y: 2) }'
    return reply.graphql(query)
});

fastify.get('/metar/:icaoidentifier', async (request, reply) => {
    const xml = await axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${request.params.icaoidentifier}&hoursBeforeNow=2`);
    const json = await xml2js.parseStringPromise(xml.data, { explicitArray: false, mergeAttrs: true });
    console.log(`json.num_results ${json.response.data.num_results}`);
    
    if (json.response.data.num_results === '0') {
        reply
            .code(404)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({});
    } else {
        let result = [];
        if (Array.isArray(json.response.data.METAR)) {
            result = json.response.data.METAR;
        } else {
            result.push(json.response.data.METAR);
        }
        let metarArray = convertMetarChildObjectToArray(result);
        reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(metarArray);
    }
});

fastify.get('/taf/:icaoidentifier', async (request, reply) => {
    const xml = await axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=${request.params.icaoidentifier}&hoursBeforeNow=4`);
    const jsonObj = await xml2js.parseStringPromise(xml.data, { explicitArray: false, mergeAttrs: true });

    const json = convertChildObjectToArray(jsonObj.response.data);
    reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(json);
    // return json;
});

fastify.get('/reportingstations', async (request, reply) => {
    const data = await fs.promises.readFile('metarlist.json', 'utf8');
    const stations = JSON.parse(data);
    reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(stations);
});

fastify.get('/reportingstations/:lat/:long/:limit', async (request, reply) => {
    const data = await fs.promises.readFile('metarlist.json', 'utf8');
    const raw_stations = JSON.parse(data);
    const lat = request.params.lat;
    const long = request.params.long;
    const limit = request.params.limit ?? 10;
    const stations = sortByClosest(raw_stations, {
        latitude: lat,
        longitude: long
    }).splice(0, limit);
    reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(stations);
});

// get closest reporting stations

const start = async () => {
    try {
        await fastify.listen(port, '0.0.0.0');
    } catch(err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
start();

/*
Latitude
30.33218	
Longitude
-81.65565
*/

function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
    const R = 3959; // Radius of the earth in miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in miles
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
  
function sortByClosest(locations, targetLocation) {
    return locations.sort((a, b) => {
        const distA = getDistanceFromLatLonInMiles(
            a.lat,
            a.long,
            targetLocation.latitude,
            targetLocation.longitude
        );
        const distB = getDistanceFromLatLonInMiles(
            b.lat,
            b.long,
            targetLocation.latitude,
            targetLocation.longitude
        );
        return distA - distB;
    });
}
  