var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import schema from '../schema.js';
import { WeatherController } from './weather.controller.js';
import { WeatherResolver } from './weather.resolver.js';
import { WeatherService } from './weather.service.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            GraphQLModule.forRoot({
                driver: ApolloDriver,
                typeDefs: schema,
                path: '/graphql',
                graphiql: true,
                playground: false,
            }),
        ],
        controllers: [WeatherController],
        providers: [WeatherResolver, WeatherService],
    })
], AppModule);
export { AppModule };
