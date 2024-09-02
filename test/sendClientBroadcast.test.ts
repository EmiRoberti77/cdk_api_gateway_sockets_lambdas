import { handler } from "../src/lambdas/LambdaBroadcastClient/handler";
import * as dotenv from "dotenv";
import { HTTP_METHOD } from "../src/util";
dotenv.config();

const endpoint = process.env.ENDPOINT!;

const message = {
  variable: "PN ASenna ch 2",
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

const functionName = "wsrunmoBroadCastLambda3";
const connectionId = "dfPj5fywIAMCKyg=";

const params = {
  httpMethod: HTTP_METHOD.POST,
  headers: {
    ContentType: "application/json",
  },
  body: JSON.stringify({
    message,
    endpoint,
    functionName,
    connectionId,
  }),
};

const runTest = async (): Promise<void> => {
  console.log(endpoint);
  const response = await handler(params as any);
  console.log(response);
};

runTest();
