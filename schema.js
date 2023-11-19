
const schema = `
  type Metar {
    raw_text: String!
    station_id: String
    observation_time: String!
    latitude: Float!
    longitude: Float!
    temp_c: Float!
    dewpoint_c: Float!
    wind_dir_degrees: Int!
    wind_speed_kt: Float!
    visibility_statute_mi: String!
    altim_in_hg: Float!
    sea_level_pressure_mb: Float
    flight_category: String
    sky_condition: [SkyCondition!]!
  }

  type Taf {
    raw_text: String!
    station_id: String!
    issue_time: String!
    bulletin_time: String!
    valid_time_from: String!
    valid_time_to: String!
    latitude: Float!
    longitude: Float!
    elevation_m: Float!
    forecast: [Forecast!]!
  }

  type Forecast {
    fcst_time_from: String!
    fcst_time_to: String!
    change_indicator: String!
    wind_dir_degrees: String
    wind_speed_kt: Int
    visibility_statute_mi: String!
    wx_string: String
    sky_condition: [SkyCondition!]
  }

  type SkyCondition {
    sky_cover: String!
    cloud_base_ft_agl: Int
  }

  type ReportingStations {
    state: String!
    site: String!
    icaoId: String!
    lat: Float!
    lon: Float!
    elev: Int!
    country: String!
  }

  type Query {
    getMetar(id: String!): [Metar!]!
    getTaf(id: String!): [Taf!]!
    getReportingStations(lat: Float!, long: Float!, limit: Int!): [ReportingStations!]!
  }
`;

export default schema;
