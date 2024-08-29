import { handler } from "../src/lambdas/LambdaBroadcastClient/handler";

interface Message {
  connectionId: string;
  message: any;
  endpoint: string;
}

const body: Message = {
  connectionId: "dQp5XdQeoAMCFSg=",
  message: `{
  "variable": "PN ASenna",
  "value": "aberto",
  "location": {
    "type": "Point",
    "coordinates": [-48.521309, -25.506428]
  },
  "metadata": {
    "color": "Black",
    "icon": "train",
    "x": 0.5,
    "y": 0.5,
    "triggered": "2024-07-18T13:56:07.785Z"
  }
}`,
  endpoint: `https://c34zox9nmj.execute-api.us-east-1.amazonaws.com/dev`,
};

const runTest = async (): Promise<void> => {
  const response = await handler({
    httpMethod: "POST",
    body: JSON.stringify(body),
  } as any);

  console.log(response);
};

runTest();
