interface BaseCommand {
  uuid: string;
  type: CommandType;
  data: any;
}

export interface ReadCommand extends BaseCommand {
  type: CommandType.Read;
  data: {
    address: number;
    bytes: number;
  };
}

export interface WriteCommand extends BaseCommand {
  type: CommandType.Write;
  data: {
    address: number;
    values: number[];
  };
}

export interface PingCommand extends BaseCommand {
  type: CommandType.Ping;
  data: {};
}

export interface AlertCommand extends BaseCommand {
  type: CommandType.Alert;
  data: {
    message: string;
    timeout: number;
  };
}

export enum CommandType {
  Read,
  Write,
  Ping,
  Alert,
}

export type Command = ReadCommand | WriteCommand | PingCommand | AlertCommand;
