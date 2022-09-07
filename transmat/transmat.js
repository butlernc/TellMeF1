// run with: node transmat.js
const { Server } = require("socket.io");
const F1TelemetryClient = require("./listener");
const { constants } = require("@racehub-io/f1-telemetry-client");
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

client.on(PACKETS.event, console.log);
client.on(PACKETS.motion, console.log);
client.on(PACKETS.carSetups, console.log);
client.on(PACKETS.lapData, console.log);
client.on(PACKETS.session, console.log);
client.on(PACKETS.participants, console.log);
client.on(PACKETS.carTelemetry, console.log);
client.on(PACKETS.carStatus, console.log);
client.on(PACKETS.finalClassification, console.log);
client.on(PACKETS.lobbyInfo, console.log);
client.on(PACKETS.carDamage, console.log);
client.on(PACKETS.sessionHistory, console.log);

client.start();

io.emit("test", "test");
