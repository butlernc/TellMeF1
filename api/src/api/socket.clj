(ns api.socket
  (:require
    [clojure.core.async :as async]
    [clojure.java.io :as io]
    [api.common :as common]
    [sockets.datagram.packet :as packet]
    [sockets.datagram.socket :as socket]))

(defn echo-service
  "For any in-coming message, simply return the same data."
  [in out]
  (async/go-loop []
    (let [dest (async/<! in)]
      (async/>! out dest)
      (recur))))

(defn packet-reader
  [sock]
  (let [in (async/chan)]
    (async/go-loop []
      (let [pkt (socket/receive sock common/max-packet-size)]
        (async/>! in {:remote-addr (packet/address pkt)
                      :remote-port (packet/port pkt)
                      :data (common/bytes->str (packet/data pkt))}))
      (recur))
    in))

(defn echo-writer
  [sock]
  (let [out (async/chan)]
    (async/go-loop []
      (let [msg (async/<! out)
            pkt-text (format "Echoing: %s\n" (:data msg))
            pkt-data (common/str->bytes pkt-text)
            pkt (packet/create pkt-data
                               (count pkt-data)
                               (:remote-addr msg)
                               (:remote-port msg))]
        (socket/send sock pkt))
      (recur))
    out))