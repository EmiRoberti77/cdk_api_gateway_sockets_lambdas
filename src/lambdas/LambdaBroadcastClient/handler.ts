import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HTTP_CODE, HTTP_METHOD, jsonApiProxyResultResponse } from "../../util";

export interface BroadCastClientEvent {
  functionName: string;
  endpoint: string;
  connectionId: string;
  message: any;
}

export interface BroadCastClientResult {
  statusCode: number;
  body: any;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== HTTP_METHOD.POST) {
    return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
      success: false,
      body: "Error:httpMethod must be POST",
    });
  }
  if (!event.body) {
    return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
      success: false,
      body: "Error:missingBody",
    });
  }

  const clientEvent: BroadCastClientEvent = JSON.parse(event.body);

  try {
    console.log(clientEvent);
    const payloadUint8Array = new TextEncoder().encode(
      JSON.stringify({
        message: clientEvent.message,
        connectionId: clientEvent.connectionId,
        endpoint: clientEvent.endpoint,
      })
    );
    const client = new LambdaClient({});
    const command = new InvokeCommand({
      FunctionName: clientEvent.functionName,
      InvocationType: "RequestResponse",
      Payload: payloadUint8Array,
    });
    const response = await client.send(command);
    const responsePayload = new TextDecoder("utf-8").decode(response.Payload);
    return {
      statusCode: 200,
      body: responsePayload,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};
