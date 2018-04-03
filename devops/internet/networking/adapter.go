package network

type Adapter struct {
	phy PHY
	mac MACAddress
}

func (a *Adapter) AttachWire(w *Wire) {

	w.phy = a.phy
}

func (a *Adapter) Init() {

	a.send(MAC_BROADCAST_ADDR, nil)
}

func (a *Adapter) send(dest MACAddress, data []byte) {

	p := &DataLinkPacket{
		dest:   dest,
		source: a.mac,
		data:   data,
	}

	a.phy <- p.asBytes()
}
