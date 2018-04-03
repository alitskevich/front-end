package network

// http://microchipdeveloper.com/tcpip:tcp-ip-five-layer-model

// IP4Address represents ip address
type IP4Address struct {
	p0   byte
	p1   byte
	p2   byte
	p3   byte
	mask Mask
}
type Address interface {
}
type IPAdapter struct {
}

type Mask byte

type Device struct {
}

type IPPacket []byte

func (d *Device) send(ip IP4Address, port *Port, data []byte) {
}

func (d *Device) listen(port *Port) {

}
