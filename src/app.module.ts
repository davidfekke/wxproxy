import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import schema from '../schema.js';
import { WeatherController } from './weather.controller.js';
import { WeatherResolver } from './weather.resolver.js';
import { WeatherService } from './weather.service.js';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typeDefs: schema,
      path: '/graphql',
      graphiql: true,
    }),
  ],
  controllers: [WeatherController],
  providers: [WeatherResolver, WeatherService],
})
export class AppModule {}
