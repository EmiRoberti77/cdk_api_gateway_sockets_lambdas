import * as cdk from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  Table,
  ProjectionType,
} from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as dotenv from "dotenv";
import path = require("path");
dotenv.config();

const V = process.env.V!;
const PROJECT = process.env.PROJECT!;

export class RegisterConnectionIdLambda extends cdk.Stack {
  public registerConnectionLambda: NodejsFunction;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    if (!V && !PROJECT) {
      console.error("Error:env file not read");
      return;
    }

    const table = new Table(this, `${PROJECT}RegisterConnectionIdTable${V}`, {
      tableName: `${PROJECT}RegisterConnectionIdTable${V}`,
      partitionKey: {
        type: AttributeType.STRING,
        name: "id",
      },
      sortKey: {
        name: "site",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    table.addGlobalSecondaryIndex({
      indexName: "connectionIdIndex",
      partitionKey: {
        name: "connectionId",
        type: AttributeType.STRING,
      },
      projectionType: ProjectionType.ALL,
    });

    const broadcastClientLambdaName = `${PROJECT}RegisterConnectionIdLambda${V}`;
    this.registerConnectionLambda = new NodejsFunction(
      this,
      broadcastClientLambdaName,
      {
        functionName: broadcastClientLambdaName,
        runtime: Runtime.NODEJS_20_X,
        handler: "handler",
        entry: path.join(
          __dirname,
          "..",
          "src",
          "lambdas",
          "LambdaRegisterConnectionId",
          "handler.ts"
        ),
        environment: {
          TABLE_NAME: table.tableName,
          TABLE_ARN: table.tableArn,
        },
      }
    );

    this.registerConnectionLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["*"],
        resources: ["*"],
      })
    );
  }
}
