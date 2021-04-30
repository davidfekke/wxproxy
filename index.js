import Fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import axios from 'axios';
import * as parser from 'fast-xml-parser';

const fastify = Fastify({ logger: true });

const port = process.env.PORT || '3000';

fastify.register(fastifyCors, { 
    // put your options here
});

fastify.get('/metar/:icaoidentifier', async (request, reply) => {
    const xml = await axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${request.params.icaoidentifier}&hoursBeforeNow=2`);
    const jsonObj = parser.parse(xml.data);
    if (jsonObj.response.data.METAR.length > 0) {
        return jsonObj.response.data.METAR;    
    } else {
        return jsonObj.response;
    }
});

fastify.get('/taf/:icaoidentifier', async (request, reply) => {
    const xml = await axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=${request.params.icaoidentifier}&hoursBeforeNow=4`);
    const jsonObj = parser.parse(xml.data);
    return jsonObj.response.data;
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