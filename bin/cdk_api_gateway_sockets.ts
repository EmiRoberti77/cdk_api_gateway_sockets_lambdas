#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkApiGatewaySocketsStack } from "../lib/cdk_api_gateway_sockets-stack";
import { BroadcastClientLambda } from "../lib/cdk_client_lambda";
import { ApiGatewayBroadast } from "../lib/cdk_api_gateway_broadast";
import { RegisterConnectionIdLambda } from "../lib/cdk_register_client_lambda";

const app = new cdk.App();
new CdkApiGatewaySocketsStack(app, "emiCDKWebSocketApiStackV2", {});
const broadcastClientLambda = new BroadcastClientLambda(
  app,
  "BroadcastClientLambda"
);
const registerConnectionIdLambda = new RegisterConnectionIdLambda(
  app,
  "rumoRegisterConnectionIdLambdaStack"
);

new ApiGatewayBroadast(app, "rumoApiGatewayBroadastStack", {
  broadCastLambda: broadcastClientLambda.broadcastClientLambda,
  registerConnectionLambda: registerConnectionIdLambda.registerConnectionLambda,
});
