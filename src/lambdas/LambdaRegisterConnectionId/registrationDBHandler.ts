import { APIGatewayProxyCallback, APIGatewayProxyResult } from "aws-lambda";
import { HTTP_CODE, jsonApiProxyResultResponse } from "../../util";
import { RegistrationParams } from "./model/registrationParams";
import { DynamoDBClient, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { ConDetailsRequest } from "./model/conDetailsRequest";
import * as dotenv from "dotenv";
dotenv.config();

export class RegistrationDBHandler {
  private registration: RegistrationParams | undefined;
  private dbClient: DynamoDBClient = new DynamoDBClient({});
  private documentClient = DynamoDBDocumentClient.from(this.dbClient);
  constructor(registration: RegistrationParams | undefined = undefined) {
    this.registration = registration;
  }

  public async register(): Promise<APIGatewayProxyResult> {
    try {
      const params = {
        TableName: process.env.TABLE_NAME,
        Item: this.registration,
      };

      const response = await this.dbClient.send(new PutCommand(params));

      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        succes: true,
        body: response.Attributes,
      });
    } catch (err: any) {
      return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
        succes: false,
        body: err.message,
      });
    }
  }

  public async getConnectionClient(
    conDetails: ConDetailsRequest
  ): Promise<APIGatewayProxyResult> {
    try {
      console.log("Input ID:", conDetails.id, "Type:", typeof conDetails.id);
      console.log(
        "Input Site:",
        conDetails.site,
        "Type:",
        typeof conDetails.site
      );
      const params: QueryCommandInput = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "#id = :id AND #site = :site",
        ExpressionAttributeNames: {
          "#id": "id",
          "#site": "site",
        },
        ExpressionAttributeValues: {
          ":id": { S: conDetails.id },
          ":site": { S: conDetails.site },
        },
      };
      console.log("query");
      const response = await this.dbClient.send(new QueryCommand(params));
      console.log(response);
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        success: true,
        body: response.Items,
      });
    } catch (err: any) {
      console.error(err);
      return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
        success: false,
        body: err.message,
      });
    }
  }

  private async allConnectionClients(): Promise<APIGatewayProxyResult> {
    return jsonApiProxyResultResponse(HTTP_CODE.OK, {
      success: true,
      body: {
        function: "allConnectionClients",
      },
    });
  }
}
