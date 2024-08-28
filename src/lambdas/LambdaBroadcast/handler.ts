import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HTTP_CODE, jsonApiProxyResultResponse } from "../../util";

interface Message {
  connectionId: string;
  message: any;
  endpoint: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
      succees: false,
      body: "Error:missing body",
    });
  }

  const message: Message = JSON.parse(event.body);

  const client = new ApiGatewayManagementApiClient({
    endpoint: message.endpoint,
  });

  try {
    const response = await client.send(
      new PostToConnectionCommand({
        ConnectionId: message.connectionId,
        Data: JSON.stringify(message),
      })
    );
    console.log(response);

    return jsonApiProxyResultResponse(HTTP_CODE.OK, {
      succees: true,
      body: {
        connectionId: message.connectionId,
        endpoint: message.endpoint,
        message: message.message,
      },
    });
  } catch (err: any) {
    console.error(err);
    return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
      succees: false,
      body: err.message,
    });
  }
};
