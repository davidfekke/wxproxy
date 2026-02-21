import { Args, Query, Resolver } from '@nestjs/graphql';
import { WeatherService } from './weather.service.js';

@Resolver('Query')
export class WeatherResolver {
  constructor(private readonly weatherService: WeatherService) {}

  @Query('getMetar')
  getMetar(@Args('id') id: string) {
    return this.weatherService.getMetar(id);
  }

  @Query('getTaf')
  getTaf(@Args('id') id: string) {
    return this.weatherService.getTaf(id);
  }

  @Query('getReportingStations')
  getReportingStations(
    @Args('lat') lat: number,
    @Args('long') long: number,
    @Args('limit') limit: number,
  ) {
    return this.weatherService.getReportingStations(lat, long, limit);
  }
}
