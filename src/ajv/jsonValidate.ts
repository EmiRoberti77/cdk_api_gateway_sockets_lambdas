import Ajv from "ajv";
const ajv = new Ajv();
const BroadCastMessageSchema = {
  type: "object",
  properties: {
    message: { type: "object" },
    connectionId: { type: "string" },
    endpoint: { type: "string" },
  },
};

export const validateBroadCastMessage = ajv.compile(BroadCastMessageSchema);
