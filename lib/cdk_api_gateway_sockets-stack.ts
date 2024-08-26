import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { WebSocketApi, WebSocketStage } from "aws-cdk-lib/aws-apigatewayv2";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import path = require("path");
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Effect, ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { WebSocketLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";

export class CdkApiGatewaySocketsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //connect lambda
    const connectLambda = new NodejsFunction(this, "wsEmiConnectLambda3", {
      functionName: "wsEmiConnectLambda3",
      handler: "handler",
      entry: path.join(
        __dirname,
        "..",
        "src",
        "lambdas",
        "lambdaConnect",
        "handler.ts"
      ),
      runtime: Runtime.NODEJS_20_X,
    });

    connectLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["*"],
        resources: ["*"],
      })
    );

    //disconnect lambda
    const disconnetLambda = new NodejsFunction(this, "wsEmiDisconnectLambda3", {
      functionName: "wsEmiDiconnectLambda3",
      handler: "handler",
      entry: path.join(
        __dirname,
        "..",
        "src",
        "lambdas",
        "lambdaDisconnect",
        "handler.ts"
      ),
      runtime: Runtime.NODEJS_20_X,
    });

    disconnetLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["*"],
        resources: ["*"],
      })
    );

    //message lambda
    const msgLambda = new NodejsFunction(this, "wsEmiMessageLambda3", {
      functionName: "wsEmiMessageLambda3",
      handler: "handler",
      entry: path.join(
        __dirname,
        "..",
        "src",
        "lambdas",
        "lambdaSendMessage",
        "handler.ts"
      ),
      runtime: Runtime.NODEJS_20_X,
    });

    msgLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["*"],
        resources: ["*"],
      })
    );

    // const wsapi = new WebSocketApi(this, "emiWSApi", {
    //   connectRouteOptions: {
    //     integration: new WebSocketLambdaIntegration(
    //       "ws-connect-integration",
    //       connectLambda
    //     ),
    //   },
    //   disconnectRouteOptions: {
    //     integration: new WebSocketLambdaIntegration(
    //       "ws-disconnect-integration",
    //       disconnetLambda
    //     ),
    //   },
    //   routeSelectionExpression: "$request.body.action",
    // });

    // const connectRoute = wsapi.addRoute("sendeMessage", {
    //   integration: new WebSocketLambdaIntegration(
    //     "ws-sendmessage-integration",
    //     msgLambda
    //   ),
    // });

    // const apiStage = new WebSocketStage(this, "DevStage", {
    //   webSocketApi: wsapi,
    //   stageName: "dev",
    //   autoDeploy: true,
    // });

    // new cdk.CfnOutput(this, "wss", {
    //   value: wsapi.apiEndpoint,
    // });
  }
}
