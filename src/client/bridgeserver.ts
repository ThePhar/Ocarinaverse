import * as net from "net";
import EventEmitter from "events";

/**
 * Single client TCP server to communicate with the luabridge script running on the emulator.
 */
export default class BridgeServer {
  private server = net.createServer();
  private client?: net.Socket;
  private emitter = new EventEmitter();

  /**
   * Add an event listener for this server.
   * @param event The event to listen for.
   * @param cb The callback function to call when the event is fired.
   */
  public on(event: "connect" | "disconnect", cb: () => void): void;
  public on(event: "data", cb: (content: string) => void): void;
  public on(event: "connect" | "disconnect" | "data", cb: (content: string) => void): void {
    this.emitter.on(event, cb);
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
   * Attempt to send a message to the connected client socket, if a client is connected.
   * @param content The string to send to the luabridge.
   */
  public send(content: string): Promise<void> {
    // Throw an Error if there is no client connected.
    if (!this.connected) {
      throw new Error("No client connected to receive message.");
    }

    return new Promise((resolve, reject) => {
      // Remove any excess whitespace on our content.
      const trimmed = content.trim();

      // We need to append a newline to the end, since that's our terminating character.
      this.client?.write(Buffer.from(trimmed) + "\n", (err) => {
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
    // TODO: Make this check for the various commands and fire events accordingly.

    // Fire any event listeners for data.
    this.emitter.emit("data", buffer.toString());
  }

  /**
   * Returns true if server has a connection to the luabridge.
   */
  public get connected(): boolean {
    return this.client !== undefined && !this.client.destroyed;
  }
}
