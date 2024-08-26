import {
  APIGatewayProxyResult,
  APIGatewayProxyWebsocketEventV2,
} from "aws-lambda";
export const handler = async (
  event: APIGatewayProxyWebsocketEventV2
): Promise<APIGatewayProxyResult> => {
  //console.log(event);
  try {
    const connectionId = event.requestContext.connectionId;
    console.log("connectionId", connectionId);
    return {
      statusCode: 200,
      body: connectionId,
    };
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Error:" + error.message,
    };
  }
};
