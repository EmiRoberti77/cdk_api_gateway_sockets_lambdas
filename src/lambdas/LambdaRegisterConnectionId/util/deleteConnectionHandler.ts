import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HTTP_CODE, jsonApiProxyResultResponse } from "../../../util";
import { RegistrationDBHandler } from "../registrationDBHandler";
type DeleteParameters = {
  id?: string;
  site?: string;
  connectionId?: string;
  mode:
    | "deleteByConnectionID"
    | "deleteByIdAndSite"
    | "noDeletionSelected"
    | "noQueryParameters";
};
export class DeleteConnectionHandler {
  delParams: DeleteParameters;
  dbClient: RegistrationDBHandler;
  constructor(event: APIGatewayProxyEvent) {
    this.delParams = {
      mode: "noDeletionSelected", //default selection
    };

    if (!event.queryStringParameters) {
      this.delParams.mode = "noQueryParameters";
    } else {
      const { id, site, connectionId } = event.queryStringParameters;
      if (id && site) {
        this.delParams.id = id;
        this.delParams.site = site;
        this.delParams.mode = "deleteByIdAndSite";
      }
      if (connectionId) {
        this.delParams.connectionId = connectionId;
        this.delParams.mode = "deleteByConnectionID";
      }
      this.dbClient = new RegistrationDBHandler();
    }
  }

  public async deleteConnection(): Promise<APIGatewayProxyResult> {
    try {
      let respose;
      switch (this.delParams.mode) {
        case "deleteByIdAndSite":
          const delParams = {
            id: this.delParams.id!,
            site: this.delParams.site!,
          };
          return await this.dbClient.DeleteConnection(delParams);
        case "deleteByConnectionID":
          return await this.dbClient.DeleteConnection(
            this.delParams.connectionId!
          );
        case "noDeletionSelected" || "noQueryParameters":
          return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
            success: false,
            message: this.delParams.mode,
          });
      }

      return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
        success: true,
        message: this.delParams,
      });
    } catch (err: any) {
      return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
        success: false,
        message: err.message,
      });
    }
  }
}
