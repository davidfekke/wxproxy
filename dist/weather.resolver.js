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
import { Args, Query, Resolver } from '@nestjs/graphql';
import { WeatherService } from './weather.service.js';
let WeatherResolver = class WeatherResolver {
    weatherService;
    constructor(weatherService) {
        this.weatherService = weatherService;
    }
    getMetar(id) {
        return this.weatherService.getMetar(id);
    }
    getTaf(id) {
        return this.weatherService.getTaf(id);
    }
    getReportingStations(lat, long, limit) {
        return this.weatherService.getReportingStations(lat, long, limit);
    }
};
__decorate([
    Query('getMetar'),
    __param(0, Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WeatherResolver.prototype, "getMetar", null);
__decorate([
    Query('getTaf'),
    __param(0, Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WeatherResolver.prototype, "getTaf", null);
__decorate([
    Query('getReportingStations'),
    __param(0, Args('lat')),
    __param(1, Args('long')),
    __param(2, Args('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], WeatherResolver.prototype, "getReportingStations", null);
WeatherResolver = __decorate([
    Resolver('Query'),
    __metadata("design:paramtypes", [WeatherService])
], WeatherResolver);
export { WeatherResolver };
