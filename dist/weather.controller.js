var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import schema from '../schema.js';
import { WeatherService } from './weather.service.js';
let WeatherController = class WeatherController {
    weatherService;
    constructor(weatherService) {
        this.weatherService = weatherService;
    }
    postSchema() {
        return schema;
    }
    getSchema() {
        return schema;
    }
    getMetar(id) {
        return this.weatherService.getMetar(id);
    }
    async getTaf(id) {
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
    getAllReportingStations() {
        return this.weatherService.getAllReportingStations();
    }
    getReportingStations(lat, long, limit) {
        return this.weatherService.getReportingStations(Number(lat), Number(long), Number(limit ?? '10'));
    }
    getForecastDiscussion(cwa) {
        return this.weatherService.getForecastDiscussion(cwa);
    }
};
__decorate([
    ApiOperation({ summary: 'Retrieve GraphQL SDL schema' }),
    Post('schema'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "postSchema", null);
__decorate([
    ApiOperation({ summary: 'Retrieve GraphQL SDL schema' }),
    Get('schema'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "getSchema", null);
__decorate([
    ApiOperation({ summary: 'Retrieve METAR data for a given station' }),
    ApiParam({ name: 'icaoidentifier', type: String }),
    Get('metar/:icaoidentifier'),
    __param(0, Param('icaoidentifier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "getMetar", null);
__decorate([
    ApiOperation({ summary: 'Retrieve TAF data for a given station' }),
    ApiParam({ name: 'icaoidentifier', type: String }),
    Get('taf/:icaoidentifier'),
    __param(0, Param('icaoidentifier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "getTaf", null);
__decorate([
    ApiOperation({ summary: 'Retrieve all aviation reporting stations' }),
    Get('reportingstations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "getAllReportingStations", null);
__decorate([
    ApiOperation({ summary: 'Retrieve nearest reporting stations' }),
    ApiParam({ name: 'lat', type: String }),
    ApiParam({ name: 'long', type: String }),
    ApiParam({ name: 'limit', required: false, type: Number }),
    Get('reportingstations/:lat/:long/:limit'),
    __param(0, Param('lat')),
    __param(1, Param('long')),
    __param(2, Param('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "getReportingStations", null);
__decorate([
    ApiOperation({ summary: 'Retrieve forecast discussion by CWA' }),
    ApiParam({ name: 'cwa', type: String }),
    Get('forecastdiscussion/:cwa'),
    __param(0, Param('cwa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "getForecastDiscussion", null);
WeatherController = __decorate([
    ApiTags('weather'),
    Controller(),
    __metadata("design:paramtypes", [WeatherService])
], WeatherController);
export { WeatherController };
