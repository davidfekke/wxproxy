import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import mercurius from 'mercurius';
import schema from './schema.js';
import { getMetarData, getTafData, getReportingStationsData, getAllReportingStationsData } from './datasource.js';

const resolvers = {
  Query: {
    getMetar: async (_, { id }) => {
        const metarArray = await getMetarData(id);
        return metarArray;
    },
    getTaf: async (_, { id }) => {
        const tafData = await getTafData(id);
        return tafData;
    },
    getReportingStations: async (_, { lat, long, limit }) => {
        const stations = await getReportingStationsData(lat, long, limit);
        return stations;
    }
  }
}

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

// Define a route to retrieve the SDL
fastify.post('/schema', (req, reply) => {
    reply.type('text/plain').send(schema);
});

fastify.get('/schema', (req, reply) => {
    reply.type('text/plain').send(schema);
});

fastify.get('/metar/:icaoidentifier', async (request, reply) => {
    const id = request.params.icaoidentifier;
    const metarArray = await getMetarData(id);
    
    if (metarArray.length === '0') {
        reply
            .code(404)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({});
    } else {
        reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(metarArray);
    }
});

fastify.get('/taf/:icaoidentifier', async (request, reply) => {
    const id = request.params.icaoidentifier;
    const json = await getTafData(id);

    reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(json);
});

fastify.get('/reportingstations', async (request, reply) => {
    const stations = await getAllReportingStationsData();
    reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(stations);
});

fastify.get('/reportingstations/:lat/:long/:limit', async (request, reply) => {
    const lat = request.params.lat;
    const long = request.params.long;
    const limit = request.params.limit ?? 10;
    const stations = await getReportingStationsData(lat, long, limit);
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
  