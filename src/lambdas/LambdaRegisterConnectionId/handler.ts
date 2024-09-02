import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HTTP_CODE, HTTP_METHOD, jsonApiProxyResultResponse } from "../../util";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== HTTP_METHOD.POST) {
    return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
      success: true,
      body: "Error:use POST",
    });
  }
  if (!event.body) {
    return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
      success: true,
      body: "Error:missing body",
    });
  }

  return jsonApiProxyResultResponse(HTTP_CODE.OK, {
    success: true,
    body: JSON.parse(event.body),
  });
};
