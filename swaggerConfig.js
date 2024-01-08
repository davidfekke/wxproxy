const swaggerConfig = {
    openapi: {
        info: {
          title: 'Aviation Weather Proxy',
          description: 'This is an API for getting aviation weather, specifically METAR and TAFs for pilots.',
          version: '0.1.0'
        },
        servers: [{
          url: 'http://localhost:3000'
        },
        {
          url: 'https://avwx.fekke.com'
        }]
    },
    hideUntagged: true,
    exposeRoute: true
};

export default swaggerConfig;
