import { ConDetailsRequest } from "../src/lambdas/LambdaRegisterConnectionId/model/conDetailsRequest";
import { RegistrationDBHandler } from "../src/lambdas/LambdaRegisterConnectionId/registrationDBHandler";

async function getConnection(con: ConDetailsRequest): Promise<boolean> {
  try {
    const dbHandler = new RegistrationDBHandler(undefined);
    //const response = await dbHandler.getAllConnectionClients();
    const response = await dbHandler.getConnectionClient(con);

    console.log(response);
    return true;
  } catch (err: any) {
    console.log(err);
    return false;
  }
}

getConnection({
  id: "1",
  site: "site1#channel1",
});
