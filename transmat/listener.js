const dgram = require("dgram");
const { EventEmitter } = require("events");

const {
  constants,
  PacketCarDamageDataParser,
  PacketCarSetupDataParser,
  PacketCarStatusDataParser,
  PacketCarTelemetryDataParser,
  PacketEventDataParser,
  PacketFinalClassificationDataParser,
  PacketFormatParser,
  PacketHeaderParser,
  PacketLapDataParser,
  PacketLobbyInfoDataParser,
  PacketMotionDataParser,
  PacketParticipantsDataParser,
  PacketSessionDataParser,
  PacketSessionHistoryDataParser,
} = require("@racehub-io/f1-telemetry-client");

const ADDRESS = "0.0.0.0";
const DEFAULT_PORT = 20777;
const BIGINT_ENABLED = true;

/**
 *
 */
class F1TelemetryClient extends EventEmitter {
  constructor(opts) {
    super();

    const { port = DEFAULT_PORT, bigintEnabled = BIGINT_ENABLED } = opts;

    this.port = port;
    this.bigintEnabled = bigintEnabled;
    this.socket = dgram.createSocket("udp4");
  }

  /**
   *
   * @param {Buffer} message
   */
  static parseBufferMessage(message, bigintEnabled = false) {
    const { m_packetFormat, m_packetId } = F1TelemetryClient.parsePacketHeader(
      message,
      bigintEnabled
    );

    const parser = F1TelemetryClient.getParserByPacketId(m_packetId);

    if (!parser) {
      return;
    }

    const packetData = new parser(message, m_packetFormat, bigintEnabled);
    const packetID = Object.keys(constants.PACKETS)[m_packetId];

    // emit parsed message
    return { packetData, packetID };
  }

  /**
   *
   * @param {Buffer} buffer
   * @param {Boolean} bigIntEnabled
   */
  static parsePacketHeader(buffer, bigintEnabled) {
    const packetFormatParser = new PacketFormatParser();
    const { m_packetFormat } = packetFormatParser.fromBuffer(buffer);
    const packetHeaderParser = new PacketHeaderParser(
      m_packetFormat,
      bigintEnabled
    );
    return packetHeaderParser.fromBuffer(buffer);
  }

  /**
   *
   * @param {Number} packetFormat
   * @param {Number} packetId
   */
  static getPacketSize(packetFormat, packetId) {
    const { PACKET_SIZES } = constants;
    const packetValues = Object.values(PACKET_SIZES);
    return packetValues[packetId][packetFormat];
  }

  /**
   *
   * @param {Number} packetId
   */
  static getParserByPacketId(packetId) {
    const { PACKETS } = constants;

    const packetKeys = Object.keys(PACKETS);
    const packetType = packetKeys[packetId];

    switch (packetType) {
      case PACKETS.session:
        return PacketSessionDataParser;

      case PACKETS.motion:
        return PacketMotionDataParser;

      case PACKETS.lapData:
        return PacketLapDataParser;

      case PACKETS.event:
        return PacketEventDataParser;

      case PACKETS.participants:
        return PacketParticipantsDataParser;

      case PACKETS.carSetups:
        return PacketCarSetupDataParser;

      case PACKETS.carTelemetry:
        return PacketCarTelemetryDataParser;

      case PACKETS.carStatus:
        return PacketCarStatusDataParser;

      case PACKETS.finalClassification:
        return PacketFinalClassificationDataParser;

      case PACKETS.lobbyInfo:
        return PacketLobbyInfoDataParser;

      case PACKETS.carDamage:
        return PacketCarDamageDataParser;

      case PACKETS.sessionHistory:
        return PacketSessionHistoryDataParser;

      default:
        return null;
    }
  }

  /**
   *
   * @param {Buffer} message
   */
  handleMessage(message) {
    const parsedMessage = F1TelemetryClient.parseBufferMessage(
      message,
      this.bigintEnabled
    );

    if (!parsedMessage || !parsedMessage.packetData) {
      return;
    }

    // emit parsed message
    this.emit(parsedMessage.packetID, parsedMessage.packetData.data);
  }

  /**
   * Method to start listening for packets
   */
  start() {
    if (!this.socket) {
      return;
    }

    this.socket.on("listening", () => {
      if (!this.socket) {
        return;
      }

      const address = this.socket.address();
      console.log(
        `UDP Client listening on ${address.address}:${address.port} 🏎`
      );
      this.socket.setBroadcast(true);
    });

    this.socket.on("message", (m) => this.handleMessage(m));
    this.socket.bind({
      address: ADDRESS,
      port: this.port,
      exclusive: false,
    });
  }

  /**
   * Method to close the client
   */
  stop() {
    if (!this.socket) {
      return;
    }

    return this.socket.close(() => {
      console.log(`UDP Client closed 🏁`);
      this.socket = undefined;
    });
  }
}

module.exports = F1TelemetryClient;
