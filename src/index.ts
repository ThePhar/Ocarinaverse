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

  const rc = 0x400020;
  const incomingPlayAddr = rc + 6;
  // const incomingItemAddr = rc + 8;

  server.onConnect(() => {
    console.log("CON");

    server.send({
      type: CommandType.Write,
      data: {
        address: incomingPlayAddr,
        values: [0x00, 0x02, 0x00, 0x01],
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
