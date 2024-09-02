import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  Cors,
  LambdaIntegration,
  ResourceOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as dotenv from "dotenv";
import { HTTP_METHOD } from "../src/util";
dotenv.config();

const V = process.env.V!;
const PROJECT = process.env.PROJECT!;

export interface ApiGatewayBroadastProps extends StackProps {
  broadCastLambda: NodejsFunction;
  registerConnectionLambda: NodejsFunction;
}

export class ApiGatewayBroadast extends Stack {
  private api: RestApi;
  constructor(scope: Construct, id: string, props: ApiGatewayBroadastProps) {
    super(scope, id, props);

    const restApiName = `${PROJECT}ApiGatewayBroadast${V}`;
    this.api = new RestApi(this, restApiName);

    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    };

    const brodacastLambdaIntegration = new LambdaIntegration(
      props.broadCastLambda
    );

    const registerConnectionIdLambdaIntegration = new LambdaIntegration(
      props.registerConnectionLambda
    );

    const apiResources = this.api.root.addResource("event", optionsWithCors);
    apiResources.addMethod(HTTP_METHOD.POST, brodacastLambdaIntegration);

    const registerResources = this.api.root.addResource(
      "connectionid",
      optionsWithCors
    );
    registerResources.addMethod(
      HTTP_METHOD.POST,
      registerConnectionIdLambdaIntegration
    );

    new CfnOutput(this, `${restApiName}UrlValue`, {
      value: this.api.url,
    });
  }
}
