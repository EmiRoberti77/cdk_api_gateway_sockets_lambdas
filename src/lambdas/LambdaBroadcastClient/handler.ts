import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

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
  event: BroadCastClientEvent
): Promise<BroadCastClientResult> => {
  try {
    const broadCastMessage = {
      message: event.message,
      connectionId: event.connectionId,
      endpoint: event.endpoint,
    };

    console.log(1);
    const jsonClientMsg = JSON.stringify(broadCastMessage);
    console.log(jsonClientMsg);
    const payloadUint8Array = new TextEncoder().encode(jsonClientMsg);
    console.log(2);
    console.log(event.functionName);
    const client = new LambdaClient({});
    const command = new InvokeCommand({
      FunctionName: event.functionName,
      InvocationType: "RequestResponse",
      Payload: payloadUint8Array,
    });
    console.log(3);
    const response = await client.send(command);
    const responsePayload = new TextDecoder("utf-8").decode(response.Payload);
    console.log(4);
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
