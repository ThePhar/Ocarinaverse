interface BaseResponse {
  uuid: string;
  type: ResponseType;
  data: any;
}

export interface AckResponse extends BaseResponse {
  type: ResponseType.Ack;
  data: {};
}

export interface DataResponse extends BaseResponse {
  type: ResponseType.Data;
  data: {
    bytes: number[];
  };
}

export interface PongResponse extends BaseResponse {
  type: ResponseType.Pong;
  data: {};
}

export enum ResponseType {
  Ack,
  Data,
  Pong,
}

export type Response = AckResponse | DataResponse | PongResponse;

export function tryConvertToResponse(json: string): Response {
  // Convert our json string into an object.
  const obj = JSON.parse(json);

  // All responses, must include a uuid, type, and data.
  if (!obj.type || !obj.uuid || !obj.data) {
    throw new Error("Invalid obj, does not contain required fields.");
  }

  // Any response of type Data, must include a number array.
  if (obj.type === ResponseType.Data && typeof obj.data[0] !== "number") {
    throw new Error("Data Response does not include an array of numbers.");
  }

  // Any other response, does not depend on its data attribute.
  return obj as Response;
}
