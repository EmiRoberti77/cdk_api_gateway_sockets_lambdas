import * as cdk from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as dotenv from "dotenv";
import path = require("path");
dotenv.config();

const V = process.env.V!;
const PROJECT = process.env.PROJECT!;
export class BroadcastClientLambda extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    if (!V && !PROJECT) {
      console.error("Error:env file not read");
      return;
    }

    const broadcastClientLambdaName = `ws${PROJECT}broadcastClientLamba${V}`;
    const broadcastClientLambda = new NodejsFunction(
      this,
      broadcastClientLambdaName,
      {
        functionName: broadcastClientLambdaName,
        runtime: Runtime.NODEJS_20_X,
        handler: "handler.ts",
        entry: path.join(
          __dirname,
          "..",
          "src",
          "lambdas",
          "LambdaBroadcastClient",
          "handler.ts"
        ),
      }
    );
    broadcastClientLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["*"],
        resources: ["*"],
      })
    );
  }
}
