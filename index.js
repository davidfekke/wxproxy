const express = require('express');
const axios = require('axios');
const parser = require('fast-xml-parser');
const cors = require('cors');

const port = process.env.PORT || '3000';
const app = express();

app.use(cors())

app.get('/metar/:icaoidentifier', (req, res) => {
    axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${req.params.icaoidentifier}&hoursBeforeNow=2`).then(xml => {
        const jsonObj = parser.parse(xml.data);
        if (jsonObj.response.data.METAR.length > 0) {
            res.json(jsonObj.response.data.METAR);    
        } else {
            res.json(jsonObj.response);
        }
    }).catch(err => {
        res.json(err);
    });
});

app.get('/taf/:icaoidentifier', (req, res) => {
    axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=${req.params.icaoidentifier}&hoursBeforeNow=4`).then(xml => {
        const jsonObj = parser.parse(xml.data);
        res.json(jsonObj.response.data);
    }).catch(err => {
        res.json(err);
    });
});

app.use(function (req, res) {
    res.status(404).send('404');
});

app.listen(port, () => console.log('Example app listening on port 3000!'));
