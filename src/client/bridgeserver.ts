import * as net from "net";

/**
 * Single client TCP server to communicate with the luabridge script running on the emulator.
 */
export default class BridgeServer {
  private server = net.createServer();
  private client?: net.Socket;

  /**
   * Start listening for connections on a given port.
   * @param port Port to accept connections on.
   */
  public listen(port: number): void {
    this.server.listen(port);
    this.server.on("connection", this.connect.bind(this));
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

    // Announce our disconnection.
    console.log("Lost connection to luabridge script, awaiting a new connection...");
  }

  /**
   * Parse and process any data sent via luabridge script.
   * @param buffer The raw data stream sent from the luabridge.
   * @private
   */
  private interpret(buffer: Buffer): void {
    // TODO: Do something interesting with this!
    console.log(`Received Data from ${this.client?.localAddress}: ${buffer}`);
  }

  /**
   * Returns true if server has a connection to the luabridge.
   */
  public get connected(): boolean {
    return this.client !== undefined && !this.client.destroyed;
  }
}
