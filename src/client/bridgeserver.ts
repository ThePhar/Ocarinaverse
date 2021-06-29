import * as net from "net";
import EventEmitter from "events";
import { AckResponse, DataResponse, PongResponse, ResponseType, tryConvertToResponse } from "./response";
import { Command } from "./command";

/**
 * Single client TCP server to communicate with the luabridge script running on the emulator.
 */
export default class BridgeServer {
  private server = net.createServer();
  private client?: net.Socket;
  private emitter = new EventEmitter();

  /**
   * Adds an event listener for connection events.
   * @param cb The callback to call on event fire.
   */
  public onConnect(cb: () => void): void {
    this.emitter.on(BridgeServerEvents.Connect, cb);
  }

  /**
   * Adds an event listener for disconnection events.
   * @param cb The callback to call on event fire.
   */
  public onDisconnect(cb: () => void): void {
    this.emitter.on(BridgeServerEvents.Disconnect, cb);
  }

  /**
   * Adds an event listener for acknowledgement events.
   * @param cb The callback to call on event fire.
   */
  public onAcknowledgement(cb: (response: AckResponse) => void): void {
    this.emitter.on(BridgeServerEvents.Acknowledgement, cb);
  }

  /**
   * Adds an event listener for data events.
   * @param cb The callback to call on event fire.
   */
  public onData(cb: (response: DataResponse) => void): void {
    this.emitter.on(BridgeServerEvents.Data, cb);
  }

  /**
   * Adds an event listener for pong events.
   * @param cb The callback to call on event fire.
   */
  public onPong(cb: (response: PongResponse) => void): void {
    this.emitter.on(BridgeServerEvents.Pong, cb);
  }

  /**
   * Start listening for connections on a given port.
   * @param port Port to accept connections on.
   */
  public listen(port: number): void {
    this.server.listen(port);
    this.server.on("connection", this.connect.bind(this));

    // Announce that we are waiting for a connection from the script.
    console.log("Now awaiting a connection from the luabridge script...");
  }

  /**
   * Attempt to send a command to the connected client socket, if a client is connected.
   * @param command The command to send to the luabridge.
   */
  public send(command: Command): Promise<void> {
    return new Promise((resolve, reject) => {
      // Throw an Error if there is no client connected.
      if (!this.client || !this.connected) {
        reject("No client connected to receive message.");
        return;
      }

      // We need to append a newline to the end, since that's our terminating character.
      this.client.write(Buffer.from(JSON.stringify(command)) + "\n", (err) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }

  /**
   * Attempt to connect a new client to our server. If we already have a client, it ignores the connection.
   * @param socket The client socket that is attempting to connect.
   * @private
   */
  private connect(socket: net.Socket): void {
    // Only allow one connection at a time.
    if (this.connected) {
      socket.write("A connection to BridgeServer already exists, disconnecting...\n", () => {
        socket.destroy();
      });
      return;
    }

    // Start listening for events from this socket.
    this.client = socket;
    this.client.on("error", this.disconnect.bind(this));
    this.client.on("close", this.disconnect.bind(this));
    this.client.on("data", this.interpret.bind(this));

    // Fire any event listeners for connections.
    this.emitter.emit("connect");

    // Announce our connection.
    console.log("Established connection with luabridge script.");
  }

  /**
   * Stop listening to any events from our client socket and drop the connection.
   * @private
   */
  private disconnect(): void {
    // Stop listening to any events regarding this client, if client exists.
    this.client?.removeAllListeners();
    this.client?.destroy();

    // Fire any event listeners for disconnections.
    this.emitter.emit("disconnect");

    // Announce our disconnection.
    console.log("Lost connection to luabridge script, awaiting a new connection...");
  }

  /**
   * Parse and process any data sent via luabridge script.
   * @param buffer The raw data stream sent from the luabridge.
   * @private
   */
  private interpret(buffer: Buffer): void {
    const content = buffer.toString();

    try {
      const response = tryConvertToResponse(content);

      switch (response.type) {
        case ResponseType.Ack:
          this.emitter.emit("ack", response as AckResponse);
          break;

        case ResponseType.Data:
          this.emitter.emit("data", response as DataResponse);
          break;

        case ResponseType.Pong:
          this.emitter.emit("pong", response as PongResponse);
          break;
      }
    } catch (err) {
      console.error(err);
      return;
    }
  }

  /**
   * Returns true if server has a connection to the luabridge.
   */
  public get connected(): boolean {
    return this.client !== undefined && !this.client.destroyed;
  }
}

export enum BridgeServerEvents {
  Connect = "connect",
  Disconnect = "disconnect",
  Acknowledgement = "ack",
  Data = "data",
  Pong = "pong",
}
