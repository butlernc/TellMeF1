// run with: node transmat.js
const { Server } = require("socket.io");
const {
  F1TelemetryClient,
  constants,
} = require("@racehub-io/f1-telemetry-client");
const { PACKETS } = constants;

const io = new Server(3456, {
  /* options */
});

io.on("connection", (socket) => {
  console.log("clojure service connected...");
});

const client = new F1TelemetryClient({ port: 20777 });
client.on(PACKETS.event, function (data) {
  console.log(data);
  io.emit(PACKETS.event, data);
});

client.start();

io.emit("test", "test");
