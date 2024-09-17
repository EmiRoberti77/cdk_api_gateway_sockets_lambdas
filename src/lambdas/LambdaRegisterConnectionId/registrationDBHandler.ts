import { APIGatewayProxyCallback, APIGatewayProxyResult } from "aws-lambda";
import {
  HTTP_CODE,
  jsonApiProxyResultResponse,
  validateIsoString,
} from "../../util";
import { RegistrationParams } from "./model/registrationParams";
import {
  DynamoDBClient,
  QueryCommandInput,
  ScanCommand,
  QueryCommand,
  ScanCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ConDetailsRequest } from "./model/conDetailsRequest";
import * as dotenv from "dotenv";
import {
  ERROR_invalid_iso_date,
  ERROR_llastActiveStateDateTime,
} from "./constants";
dotenv.config();

export class RegistrationDBHandler {
  private registration: RegistrationParams | undefined;
  private dbClient: DynamoDBClient = new DynamoDBClient({});
  private documentClient = DynamoDBDocumentClient.from(this.dbClient);
  constructor(registration: RegistrationParams | undefined = undefined) {
    this.registration = registration;
    console.log("in constructor", this.registration);
  }

  public async register(): Promise<APIGatewayProxyResult> {
    if (this.registration)
      this.registration.connectionOpenedDateTime = new Date().toISOString();

    if (!this.registration?.lastActiveStateDateTime) {
      return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
        succes: false,
        body: ERROR_llastActiveStateDateTime,
      });
    }

    if (!validateIsoString(this.registration?.lastActiveStateDateTime)) {
      return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
        succes: false,
        body: ERROR_invalid_iso_date,
      });
    }
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
      console.log(conDetails);
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

      console.log("checking db");
      const response = await this.dbClient.send(new QueryCommand(params));
      console.log(response);
      let connectionObject = {};
      if (response.Items && response.Items?.length > 0) {
        connectionObject = unmarshall(response.Items[0]);
      }
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        success: true,
        body: connectionObject,
      });
    } catch (err: any) {
      console.error(err);
      return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
        success: false,
        body: err.message,
      });
    }
  }

  public async getConnectionsClient(
    id: string
  ): Promise<APIGatewayProxyResult> {
    try {
      const params: QueryCommandInput = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: {
          "#id": "id",
        },
        ExpressionAttributeValues: {
          ":id": { S: id },
        },
      };

      console.log("checking db");
      const response = await this.dbClient.send(new QueryCommand(params));
      console.log(response);

      let connections: any[] = [];
      if (response.Items && response.Items?.length > 0) {
        connections = response.Items.map((conection) => unmarshall(conection));
      }
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        success: true,
        body: connections,
      });
    } catch (err: any) {
      console.error(err);
      return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
        success: false,
        body: err.message,
      });
    }
  }

  public async getAllConnectionClients(): Promise<APIGatewayProxyResult> {
    try {
      const p: ScanCommandInput = {
        TableName: process.env.TABLE_NAME,
      };
      const response = await this.dbClient.send(new ScanCommand(p));
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
}
