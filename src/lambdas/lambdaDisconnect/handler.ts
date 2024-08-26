import {
  APIGatewayProxyResult,
  APIGatewayProxyWebsocketEventV2,
} from "aws-lambda";
export const handler = async (
  event: APIGatewayProxyWebsocketEventV2
): Promise<APIGatewayProxyResult> => {
  console.log(event);
  return {
    statusCode: 200,
    body: "Message Recieved",
  };
};
