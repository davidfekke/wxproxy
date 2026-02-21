# WXProxy

This is an aviation weather proxy service based around the aviationweather.gov web service. That web service only returns XML. This proxy returns the same data, but in a JSON format.

The runtime is now based on NestJS and exposes:

- REST endpoints for METAR/TAF/reporting station/forecast discussion data
- GraphQL endpoint at `/graphql`
- OpenAPI 3.0 + Swagger UI at `/docs` (and JSON at `/docs-json`)
