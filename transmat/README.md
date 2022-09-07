# System

game > port forward > wsl > transmat > api > client

## Game

Game broadcasts on 0.0.0.0:20777

## Port Forward

on the wsl

> port_forwarding

> netsh interface portproxy set v4tov4 listenport=20777 listenaddress=0.0.0.0 connectport=20777 connectaddress=$(wsl hostname -I)

## WSL

start the transmat

> npm run start

start the clojure program to listen on port 3456

> lein run 3456

### WSL ip address from windows

> wsl hostname -i
