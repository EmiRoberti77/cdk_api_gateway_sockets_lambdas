import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HTTP_CODE, HTTP_METHOD, jsonApiProxyResultResponse } from "../../util";
import { RegistrationDBHandler } from "./registrationDBHandler";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let handler: RegistrationDBHandler;
  switch (event.httpMethod) {
    case HTTP_METHOD.POST:
      if (!event.body) {
        return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
          success: false,
          body: "Error:missing body",
        });
      }
      handler = new RegistrationDBHandler(JSON.parse(event.body));
      return await handler.register();
    case HTTP_METHOD.GET:
      handler = new RegistrationDBHandler();
      if (!event.queryStringParameters) {
        return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
          success: false,
          body: "Error:missing query strings",
        });
      }
      const { id, site } = event.queryStringParameters;
      if (!id || !site) {
        return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
          success: false,
          body: "Error:missing id or site in the query string",
        });
      }
      console.log(event.queryStringParameters);
      console.log("id", id);
      console.log("site", site);
      return await handler.getConnectionClient({ id, site });
    default:
      return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
        success: true,
        body: `Error:${event.httpMethod} not supported`,
      });
  }
};
