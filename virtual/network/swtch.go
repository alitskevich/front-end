package network

type Switch struct {
	ports   []SwitchPort
	mapping []MACAddress
}
type SwitchPortNum byte

const WRONG_PORT_NUM = SwitchPortNum(255)

type SwitchPort struct {
	num      SwitchPortNum
	wiredMAC MACAddress
}

func (sw *Switch) resolve(dest MACAddress) (SwitchPortNum, bool) {
	for n, mac := range sw.mapping {
		if mac == dest {
			return SwitchPortNum(n), true
		}
	}

	return WRONG_PORT_NUM, false
}

func (sw *SwitchPort) send() {
}

func (sw *Switch) Init() {

	p := <-sw.ch
	if p.isBroadcasting() {
		sw.ports[0].send(p)
		return
	}

}
