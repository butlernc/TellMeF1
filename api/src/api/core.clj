(ns api.core
  (:require 
    [api.common :as common]
    [api.socket :as socket]
    [sockets.datagram.socket :as dSocket]
    [inet.address :as inet]
    [clojure.core.async :as async]
  )
)

(defn -main
  "I don't do a whole lot ... yet."
  [& [port & args]]
  (println "Starting server ...")
  (let [sock (dSocket/create (common/get-port port))]
    (println (format "Listening on udp://%s:%s ..."
                     (inet/host-address (dSocket/local-address sock))
                     (dSocket/local-port sock)))
    (async/go
      (socket/echo-service
        (socket/packet-reader sock)
        (socket/echo-writer sock)))
    (.join (Thread/currentThread)))
)

