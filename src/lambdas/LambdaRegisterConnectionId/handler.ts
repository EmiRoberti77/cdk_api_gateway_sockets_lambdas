import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HTTP_CODE, HTTP_METHOD, jsonApiProxyResultResponse } from "../../util";
import { RegistrationDBHandler } from "./registrationDBHandler";
import {
  ERROR_body,
  ERROR_httpMethod,
  ERROR_missing_id,
  ERROR_queryString,
} from "./constants";
import { DeleteConnectionHandler } from "./util/deleteConnectionHandler";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let handler: RegistrationDBHandler;
  console.log(event);
  switch (event.httpMethod) {
    case HTTP_METHOD.POST:
      if (!event.body) {
        return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
          success: false,
          body: ERROR_body,
        });
      }
      handler = new RegistrationDBHandler(JSON.parse(event.body));
      return await handler.register();
    case HTTP_METHOD.GET:
      handler = new RegistrationDBHandler();
      if (!event.queryStringParameters) {
        return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
          success: false,
          body: ERROR_queryString,
        });
      }
      const { id: getid } = event.queryStringParameters;
      if (!getid) {
        return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
          success: false,
          body: ERROR_missing_id,
        });
      }
      return await handler.getConnectionsClient(getid);
    case HTTP_METHOD.DELETE:
      //this method has two modes.
      // a delete can be performed by ( id & site ) or by ( connectionId )
      const deleteHandler = new DeleteConnectionHandler(event);
      return await deleteHandler.deleteConnection();
    // const { id: deleteId, site: deleteSiteId } =
    //   event.queryStringParameters || {};
    // if (!deleteId || !deleteSiteId) {
    //   return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
    //     success: false,
    //     body: ERROR_missing_id,
    //   });
    // }
    // handler = new RegistrationDBHandler();
    // return await handler.DeleteConnection({
    //   id: deleteId,
    //   site: deleteSiteId,
    // });
    default:
      return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
        success: true,
        body: ERROR_httpMethod(event.httpMethod),
      });
  }
};
