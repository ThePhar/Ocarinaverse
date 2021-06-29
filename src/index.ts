import BridgeServer from "./client/bridgeserver";
import { CommandType } from "./client/command";

/**
 * The is the main function that is called at the start of our application. This is so we can have async-await in our
 * starting code.
 */
async function main() {
  // Test code, ignore this.
  const server = new BridgeServer();
  server.listen(8081);

  server.onConnect(() => {
    console.log("CON");

    server.send({
      type: CommandType.Write,
      data: {
        address: 0x11a5d0 + 0x0034,
        values: [0, 42],
      },
      uuid: "test",
    });
  });

  server.onDisconnect(() => {
    console.log("DIS");
  });

  server.onAcknowledgement((response) => {
    console.log(`ACK ${response.uuid} - ${response.type}, DATA: ${response.data}`);
  });

  server.onData((response) => {
    console.log(`DAT ${response.uuid} - ${response.type}, DATA: ${response.data.bytes}`);
  });

  server.onPong((response) => {
    console.log(`PNG ${response.uuid} - ${response.type}, DATA: ${response.data}`);
  });
}

// Our main entry point starts here.
void main();
