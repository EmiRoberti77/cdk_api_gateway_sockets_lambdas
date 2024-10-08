import {
  APIGatewayProxyWebsocketEventV2,
  APIGatewayProxyResult,
} from "aws-lambda";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
const ERROR = "Error:httpsUrl is undefined";

interface MessagePayload {
  action: string;
  connectionId?: string;
  message: any;
}

enum msgHandlerExceptions {
  GONE_EXCEPTION = "GoneException",
}

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2
): Promise<APIGatewayProxyResult> => {
  console.log("v1");
  console.log(event);
  const connectionId = event.requestContext.connectionId;
  const endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;
  //const connectionId = event.requestContext.connectionId;
  console.log(endpoint);
  const client = new ApiGatewayManagementApiClient({
    apiVersion: "2018-11-29",
    endpoint,
  });
  if (!event.body) {
    const err = "Error:missing body";
    console.error(err);
    throw new Error(err);
  }
  const eventBody: MessagePayload = JSON.parse(event.body);
  const message = eventBody.message;
  const payload = {
    ConnectionId: connectionId,
    Data: JSON.stringify({
      connectionId,
      message,
    }),
  };
  console.log("PAYLOAD", payload);
  try {
    const command = new PostToConnectionCommand(payload);
    await client.send(command);
    console.log("message posted");
    return {
      statusCode: 200,
      body: "message sent",
    };
  } catch (error: any) {
    if (error.name === msgHandlerExceptions.GONE_EXCEPTION) {
      console.error(
        `Connection ${connectionId} is gone, cleaning up in a connectionDB`
      );
      return {
        statusCode: 410,
        body: "Connection is gone",
      };
    } else {
      console.error("Error posting to connection:", error);
      return { statusCode: 500, body: error.message };
    }
  }
};
