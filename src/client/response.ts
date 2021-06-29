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
