import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { APIGatewayProxyResult } from "aws-lambda";
import { HTTP_CODE, jsonApiProxyResultResponse } from "../../util";
import { validateBroadCastMessage } from "../../ajv/jsonValidate";
import { validateAdditionalItems } from "ajv/dist/vocabularies/applicator/additionalItems";

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
  const valid = validateBroadCastMessage(event);
  if (!valid) {
    return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
      succees: false,
      body: validateBroadCastMessage.errors,
    });
  }

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
