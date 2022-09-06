// run with: node transmat.js
const { Server } = require("socket.io");
const { F122UDP } = require("f1-22-udp");
const io = new Server(3456, {
  /* options */
});
/*
 *   'port' is optional, defaults to 20777
 *   'address' is optional, defaults to localhost, in certain cases you may need to set address explicitly
 */

io.on("connection", (socket) => {
  console.log("clojure service connected...");
});

const f122 = new F122UDP();
f122.start();
// motion 0
f122.on("motion", function (data) {
  console.log(data);
  io.emit("motion", data);
});

f122.on("event", (data) => {
  console.log(data);
  io.emit("event", data);
});
