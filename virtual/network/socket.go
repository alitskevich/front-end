package network

type Protocol string

const TCP = Protocol("TCP")
const UDP = Protocol("UDP")

// Network represents physical network level
type Socket struct {
	proto    Protocol
	port     Port
	endpoint Endpoint
}

type Port int

type Endpoint struct {
	address Address
	port    Port
}

/**
*
  Socket socket = getSocket(type = "TCP")
 connect(socket, address = "1.2.3.4", port = "80")
 send(socket, "Hello, world!")
 close(socket)
*/
