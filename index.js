//const express = require('express');
import Fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import axios from 'axios';
import * as parser from 'fast-xml-parser';

const fastify = Fastify({ logger: true });

const port = process.env.PORT || '3000';

fastify.register(fastifyCors, { 
    // put your options here
});

fastify.get('/metar/:icaoidentifier', async function(request, reply) {
    const path = `https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${request.params.icaoidentifier}&hoursBeforeNow=2`;
    const xml =  await axios.get(path);
    const jsonObj = parser.parse(xml.data);
    if (jsonObj.response.data.METAR.length > 0) {
        //return jsonObj.response.data.METAR;    
        reply.send(jsonObj.response.data.METAR);
    } else {
        //return jsonObj.response;
        reply.send(jsonObj.response);
    }
});

fastify.get('/taf/:icaoidentifier', async function(request, reply) {
    const path = `https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=${request.params.icaoidentifier}&hoursBeforeNow=4`;
    const xml = await axios.get(path);
    const jsonObj = parser.parse(xml.data);
    return jsonObj.response.data;
});

const start = async () => {
    try {
        await fastify.listen(port);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();

// app.get('/metar/:icaoidentifier', (req, res) => {
//     axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${req.params.icaoidentifier}&hoursBeforeNow=2`).then(xml => {
//         const jsonObj = parser.parse(xml.data);
//         if (jsonObj.response.data.METAR.length > 0) {
//             res.json(jsonObj.response.data.METAR);    
//         } else {
//             res.json(jsonObj.response);
//         }
//     }).catch(err => {
//         res.json(err);
//     });
// });

// app.get('/taf/:icaoidentifier', (req, res) => {
//     axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=${req.params.icaoidentifier}&hoursBeforeNow=4`).then(xml => {
//         const jsonObj = parser.parse(xml.data);
//         res.json(jsonObj.response.data);
//     }).catch(err => {
//         res.json(err);
//     });
// });

// app.use(function (req, res) {
//     res.status(404).send('404');
// });

//app.listen(port, () => console.log('Example app listening on port 3000!'));
