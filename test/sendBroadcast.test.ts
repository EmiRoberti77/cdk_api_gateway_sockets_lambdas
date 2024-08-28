import { handler } from "../src/lambdas/LambdaBroadcast/handler";

interface Message {
  connectionId: string;
  message: any;
  endpoint: string;
}

const body: Message = {
  connectionId: "dNNv1f0aIAMCFNQ=",
  message: "testLambda",
  endpoint: `https://369eizuvs5.execute-api.us-east-1.amazonaws.com/dev`,
};

const runTest = async (): Promise<void> => {
  const response = await handler({
    httpMethod: "POST",
    body: JSON.stringify(body),
  } as any);

  console.log(response);
};

runTest();
