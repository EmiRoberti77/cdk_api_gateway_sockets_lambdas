import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HTTP_CODE, jsonApiProxyResultResponse } from "../../util";

interface Location {
  type: string;
  coordinates: [number, number];
}

interface Metadata {
  color: string;
  icon: string;
  x: number;
  y: number;
  triggered: string; // Assuming this is an ISO date string
}

interface Message {
  variable: string;
  value: string;
  location: Location;
  metadata: Metadata;
}

interface WSMessage {
  message: Message;
  connectionId: string;
  endpoint: string;
}

export const handler = async (
  event: WSMessage
): Promise<APIGatewayProxyResult> => {
  console.log("in handler");
  console.log(event);
  // if (!event.body) {
  //   return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
  //     succees: false,
  //     body: "Error:missing body",
  //   });
  // }

  const client = new ApiGatewayManagementApiClient({
    endpoint: event.endpoint,
  });

  try {
    const response = await client.send(
      new PostToConnectionCommand({
        ConnectionId: event.connectionId,
        Data: JSON.stringify(event.message),
      })
    );
    console.log(response);

    return jsonApiProxyResultResponse(HTTP_CODE.OK, {
      succees: true,
      body: {
        connectionId: event.connectionId,
        endpoint: event.endpoint,
        message: event.message,
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
