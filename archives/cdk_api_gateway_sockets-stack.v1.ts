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
    //api
    const api = new WebSocketApi(this, "emiWSApi", {
      apiName: "emiWSApi",
      routeSelectionExpression: "$request.body.action",
    });
    //table
    const table = new Table(this, "connectionIdTable", {
      tableName: "connectionIdTable",
      partitionKey: {
        name: "ConnectionId",
        type: AttributeType.STRING,
      },
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    //connect lambda
    const connectLambda = new NodejsFunction(this, "wsConnectLambda", {
      functionName: "wsConnectLambda",
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
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    connectLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["*"],
        resources: ["*"],
      })
    );

    //disconnect lambda
    const disconnetLambda = new NodejsFunction(this, "wsDisconnectLambda", {
      functionName: "wsDiconnectLambda",
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
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    disconnetLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["*"],
        resources: ["*"],
      })
    );

    //message lambda
    const msgLambda = new NodejsFunction(this, "wsMessageLambda2", {
      functionName: "wsMessageLambda2",
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
      environment: {
        TABLE_NAME: table.tableName,
        ENDPOINT_URL: `https://${api.apiId}.execute-api.${this.region}.amazon.com/dev`,
      },
    });

    // msgLambda.addToRolePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ["execute-api:ManagedConnections"],
    //     resources: [
    //       `arn:aws:execute-api:${this.region}:${this.account}:${api.apiId}/*`,
    //     ],
    //   })
    // );

    msgLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["*"],
        resources: ["*"],
      })
    );

    //table.grantFullAccess(msgLambda);

    const role = new cdk.aws_iam.Role(this, "RoleForApiGwInvokeLambda", {
      roleName: "InvokeLambdaRoleApiGw",
      assumedBy: new cdk.aws_iam.ServicePrincipal("apigateway.amazonaws.com"),
    });

    // Attach AmazonAPIGatewayInvokeFullAccess managed policy to all Lambda functions
    connectLambda.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonAPIGatewayInvokeFullAccess")
    );
    disconnetLambda.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonAPIGatewayInvokeFullAccess")
    );
    msgLambda.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonAPIGatewayInvokeFullAccess")
    );

    const connectRoute = api.addRoute("$connect", {
      integration: new WebSocketLambdaIntegration(
        "connectionIntegration",
        connectLambda
      ),
    });

    const disconnectRoute = api.addRoute("$disconnect", {
      integration: new WebSocketLambdaIntegration(
        "disconnectIntegration",
        disconnetLambda
      ),
    });

    const messageRoute = api.addRoute("sendMessage", {
      integration: new WebSocketLambdaIntegration(
        "messageIntegration",
        msgLambda
      ),
    });

    // const deployment = new cdk.aws_apigatewayv2.CfnDeployment(
    //   this,
    //   "deployment",
    //   {
    //     apiId: api.apiId,
    //   }
    // );

    // Define the WebSocket API Stage
    new WebSocketStage(this, "DevStage", {
      webSocketApi: api,
      stageName: "dev",
      autoDeploy: true,
    });

    // deployment.node.addDependency(connectLambda);
    // deployment.node.addDependency(disconnectRoute);
    // deployment.node.addDependency(msgLambda);
  }
}
