import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import schema from '../schema.js';
import { WeatherService } from './weather.service.js';

@ApiTags('weather')
@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @ApiOperation({ summary: 'Retrieve GraphQL SDL schema' })
  @Post('schema')
  postSchema() {
    return schema;
  }

  @ApiOperation({ summary: 'Retrieve GraphQL SDL schema' })
  @Get('schema')
  getSchema() {
    return schema;
  }

  @ApiOperation({ summary: 'Retrieve METAR data for a given station' })
  @ApiParam({ name: 'icaoidentifier', type: String })
  @Get('metar/:icaoidentifier')
  getMetar(@Param('icaoidentifier') id: string) {
    return this.weatherService.getMetar(id);
  }

  @ApiOperation({ summary: 'Retrieve TAF data for a given station' })
  @ApiParam({ name: 'icaoidentifier', type: String })
  @Get('taf/:icaoidentifier')
  async getTaf(@Param('icaoidentifier') id: string) {
    const tafData = await this.weatherService.getTaf(id);
    for (const item of tafData) {
      if (item.forecast) {
        for (const forecast of item.forecast) {
          if (forecast.sky_condition && Array.isArray(forecast.sky_condition)) {
            forecast.sky_condition = forecast.sky_condition.filter((sc) => sc !== undefined && sc !== null);
          }
        }
      }
    }
    return tafData;
  }

  @ApiOperation({ summary: 'Retrieve all aviation reporting stations' })
  @Get('reportingstations')
  getAllReportingStations() {
    return this.weatherService.getAllReportingStations();
  }

  @ApiOperation({ summary: 'Retrieve nearest reporting stations' })
  @ApiParam({ name: 'lat', type: String })
  @ApiParam({ name: 'long', type: String })
  @ApiParam({ name: 'limit', required: false, type: Number })
  @Get('reportingstations/:lat/:long/:limit')
  getReportingStations(
    @Param('lat') lat: string,
    @Param('long') long: string,
    @Param('limit') limit: string,
  ) {
    return this.weatherService.getReportingStations(Number(lat), Number(long), Number(limit) || 10);
  }

  @ApiOperation({ summary: 'Retrieve forecast discussion by CWA' })
  @ApiParam({ name: 'cwa', type: String })
  @Get('forecastdiscussion/:cwa')
  getForecastDiscussion(@Param('cwa') cwa: string) {
    return this.weatherService.getForecastDiscussion(cwa);
  }
}
