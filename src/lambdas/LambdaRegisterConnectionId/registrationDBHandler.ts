import { APIGatewayProxyResult } from "aws-lambda";
import { HTTP_CODE, jsonApiProxyResultResponse } from "../../util";
import { RegistrationParams } from "./model/registrationParams";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

export class RegistrationDBHandler {
  private registration: RegistrationParams;
  private dbClient: DynamoDBClient = new DynamoDBClient({});
  private documentClient = DynamoDBDocumentClient.from(this.dbClient);
  constructor(registration: RegistrationParams) {
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
}
