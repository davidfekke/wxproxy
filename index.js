import Fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import axios from 'axios';
//import * as parser from 'fast-xml-parser';
//import * as parser from 'fastify-xml-body-parser';
import xml2js from 'xml2js';

const fastify = Fastify({ logger: true });

const port = process.env.PORT || '3000';

fastify.register(fastifyCors, { 
    // put your options here
});

//fastify.register(parser);

let parseroptions = {
    parseNodeValue: true,
    parseAttributeValue: true
}

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
        reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(result);
    }
});

fastify.get('/taf/:icaoidentifier', async (request, reply) => {
    const xml = await axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=${request.params.icaoidentifier}&hoursBeforeNow=4`);
    const jsonObj = await xml2js.parseStringPromise(xml.data, { explicitArray: false, mergeAttrs: true });
    return jsonObj.response.data.TAF;
});

const start = async () => {
    try {
        await fastify.listen(port, '0.0.0.0');
    } catch(err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
start();