package network

// Network represents physical network level
type NATRecord struct {
	srcIP   Address
	srcPrt  Port
	dstIP   Address
	destPrt Port
}

type Router struct {
	nat []NATRecord
}

func (r *Router) send(p TCPPacket) {

}
