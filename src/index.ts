import BridgeServer from "./client/bridgeserver";

/**
 * The is the main function that is called at the start of our application. This is so we can have async-await in our
 * starting code.
 */
async function main() {
  // Test code, ignore this.
  const server = new BridgeServer();
  server.listen(8081);
}

// Our main entry point starts here.
void main();
