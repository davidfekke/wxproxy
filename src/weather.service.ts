import { Injectable } from '@nestjs/common';
import { getMetarData, getTafData, getReportingStationsData, getAllReportingStationsData, getForecastDiscussion } from '../datasource.js';

@Injectable()
export class WeatherService {
  getMetar(id: string) {
    return getMetarData(id);
  }

  getTaf(id: string) {
    return getTafData(id);
  }

  getReportingStations(lat: number, long: number, limit = 10) {
    return getReportingStationsData(lat, long, limit);
  }

  getAllReportingStations() {
    return getAllReportingStationsData();
  }

  getForecastDiscussion(cwa: string) {
    return getForecastDiscussion(cwa);
  }
}
