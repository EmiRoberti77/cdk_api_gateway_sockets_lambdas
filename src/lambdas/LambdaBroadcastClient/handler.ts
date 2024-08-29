import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

export interface BroadCastClientEvent {
  functionName: string;
  endpoint: string;
  body: any;
}

export interface BroadCastClientResult {
  statusCode: number;
  body: any;
}

export const handler = async (
  event: BroadCastClientEvent
): Promise<BroadCastClientResult> => {
  try {
    const payload = {
      variable: "PN ASenna",
      value: "aberto",
      location: {
        type: "Point",
        coordinates: [-48.521309, -25.506428],
      },
      metadata: {
        color: "Black",
        icon: "train",
        x: 0.5,
        y: 0.5,
        triggered: "2024-07-18T13:56:07.785Z",
      },
    };
    const client = new LambdaClient({});
    const command = new InvokeCommand({
      FunctionName: event.functionName,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(payload),
    });

    const response = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};
