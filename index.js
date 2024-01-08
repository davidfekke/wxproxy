import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import mercurius from 'mercurius';
import schema from './schema.js';
import { getMetarData, getTafData, getReportingStationsData, getAllReportingStationsData } from './datasource.js';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import swaggerConfig from './swaggerConfig.js';
import swaggerUIConfig from './swaggerUIConfig.js';

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
});

await fastify.register(fastifySwagger, swaggerConfig);
await fastify.register(fastifySwaggerUi, swaggerUIConfig);

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

fastify.get('/metar/:icaoidentifier', 
    {
        schema: {
            description: 'Retrieve METAR data for a given station',
            tags: ['METAR'],
            summary: 'Returns METAR information for the specified ICAO station identifier',
            params: {
            type: 'object',
            properties: {
                icaoidentifier: {
                type: 'string',
                description: 'ICAO Station Identifier'
                }
            },
            required: ['icaoidentifier']
            },
            response: {
            200: {
                description: 'Successful response',
                type: 'array',
                items: {
                type: 'object',
                properties: {
                    raw_text: { type: 'string' },
                    station_id: { type: 'string' },
                    observation_time: { type: 'string', format: 'date-time' },
                    latitude: { type: 'string' },
                    longitude: { type: 'string' },
                    temp_c: { type: 'string' },
                    dewpoint_c: { type: 'string' },
                    wind_dir_degrees: { type: 'string' },
                    wind_speed_kt: { type: 'string' },
                    visibility_statute_mi: { type: 'string' },
                    altim_in_hg: { type: 'string' },
                    sea_level_pressure_mb: { type: 'string' },
                    quality_control_flags: {
                    type: 'object',
                    properties: {
                        auto_station: { type: 'string' }
                    }
                    },
                    sky_condition: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                        sky_cover: { type: 'string' }
                        }
                    }
                    },
                    flight_category: { type: 'string' },
                    metar_type: { type: 'string' },
                    elevation_m: { type: 'string' },
                    // Add other fields if they are consistently present in the response
                }
                }
            }
            }
        }
    },
    async (request, reply) => {
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

fastify.get('/taf/:icaoidentifier', 
    {
        schema: {
            description: 'Retrieve TAF data for a given station',
            tags: ['TAF'],
            summary: 'Returns TAF information for the specified ICAO station identifier',
            params: {
                type: 'object',
                properties: {
                    icaoidentifier: { type: 'string' }
                },
                required: ['icaoidentifier']
            },
            response: {
                200: {
                    description: 'Successful response',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            raw_text: { type: 'string' },
                            station_id: { type: 'string' },
                            issue_time: { type: 'string' },
                            bulletin_time: { type: 'string' },
                            valid_time_from: { type: 'string' },
                            valid_time_to: { type: 'string' },
                            latitude: { type: 'string' },
                            longitude: { type: 'string' },
                            elevation_m: { type: 'string' },
                            forecast: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        fcst_time_from: { type: 'string' },
                                        fcst_time_to: { type: 'string' },
                                        change_indicator: { type: 'string' },
                                        wind_dir_degrees: { type: 'string' },
                                        wind_speed_kt: { type: 'string' },
                                        wind_gust_kt: { type: 'string' },
                                        visibility_statute_mi: { type: 'string' },
                                        wx_string: { type: 'string' },
                                        sky_condition: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    sky_cover: { type: 'string' },
                                                    cloud_base_ft_agl: { type: 'string' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    async (request, reply) => {
        const id = request.params.icaoidentifier;
        const json = await getTafData(id);

        reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(json);
});

fastify.get('/reportingstations', {
        schema: {
            description: 'This returns a list of all of the aviation reporting stations',
            tags: ['REPORTING_STATION'],
            summary: 'This returns a list of all of the aviation reporting stations with a specified ICAO station identifier',
            response: {
                200: {
                    description: 'Successful response',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            icaoId: { type: 'string' },
                            iataId: { type: 'string' },
                            faaId: { type: 'string' },
                            wmoId: { type: 'string' },
                            lat: { type: 'string' },
                            lon: { type: 'string' },
                            elev: { type: 'integer' },
                            site: { type: 'string' },
                            state: { type: 'string' },
                            country: { type: 'string' },
                            priority:  { type: 'integer' }
                        }
                    }
                }
            }
        }
    }, 
    async (request, reply) => {
        const stations = await getAllReportingStationsData();
        reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(stations);
});

fastify.get('/reportingstations/:lat/:long/:limit', {
        schema: {
            description: 'This returns a list of aviation reporting stations',
            tags: ['REPORTING_STATION'],
            summary: 'This returns a list of the aviation reporting stations with a specified ICAO station identifier based on being nearest to latitude and longitude with a default limit of the 10 closest stations',
            params: {
                type: 'object',
                properties: {
                    lat: { type: 'string' },
                    long: { type: 'string' },
                    limit: { type: 'integer' }
                },
                required: ['lat', 'long']
            },
            response: {
                200: {
                    description: 'Successful response',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            icaoId: { type: 'string' },
                            iataId: { type: 'string' },
                            faaId: { type: 'string' },
                            wmoId: { type: 'string' },
                            lat: { type: 'string' },
                            lon: { type: 'string' },
                            elev: { type: 'integer' },
                            site: { type: 'string' },
                            state: { type: 'string' },
                            country: { type: 'string' },
                            priority:  { type: 'integer' }
                        }
                    }
                }
            }
        }
    },
    async (request, reply) => {
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
        await fastify.listen({ port });
        fastify.swagger();
    } catch(err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
start();
