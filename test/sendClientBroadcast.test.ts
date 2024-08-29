import { handler } from "../src/lambdas/LambdaBroadcastClient/handler";
import * as dotenv from "dotenv";
dotenv.config();

const endpoint = process.env.ENDPOINT!;

const message = {
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

const runTest = async (): Promise<void> => {
  console.log(endpoint);
  const response = await handler({
    endpoint,
    functionName: "wsrunmoBroadCastLambda3",
    message,
    connectionId: "dSRe2cK-IAMCE0g=",
  });
};

runTest();
