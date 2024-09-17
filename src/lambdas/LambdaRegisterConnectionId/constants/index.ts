export const ERROR_llastActiveStateDateTime =
  "Error:missing lastActiveStateDateTime attribute";
export const ERROR_invalid_iso_date =
  "Error: invalide lastActiveStateDateTime format, must be iso string (2024-09-17T14:45:30.000Z)";
export const ERROR_queryString = "Error:missing query strings";
export const ERROR_body = "Error:missing body";
export const ERROR_missing_id = "Error:missing id";
export const ERROR_httpMethod = (httpMethod: string) =>
  `Error:${httpMethod} not supported`;
export const CONNECTION_DELETED = "conncetion deleted";
