const enumerations = {
    Protocol: {
        TCP: "TCP",
        UDP: "UDP"
    }
}

// Network represents physical network level
const structs = {
    Port: 'int[0..65534]',
    Socket: {
        protocol: 'enum<Protocol>',
        port: 'Port',
        endpoint: 'Endpoint',
    },
    Endpoint: {
        address: 'Address',
        port: 'Port'
    },
    MACAddress: {
        p0,p1,p2,p3,p4,p5,p6,p7: 'byte',
    },

    DataLinkPacket: '[]byte',
    // http://microchipdeveloper.com/tcpip:tcp-ip-five-layer-model

    // IP4Address represents ip address
    IP4Address: {
        p0,p1,p2,p3: 'byte',
        mask: 'Mask',
    },
    Address: {},
    IPAdapter: {},
    IPPacket: '[]byte',

    Mask: 'byte',

    NATRecord: {
        srcIP:   'Address',
        srcPrt:  'Port',
        dstIP:   'Address',
        destPrt: 'Port'
    },
    Router: {
        NAT: '[]NATRecord'
    },
    SwitchPort: {
        num: "SwitchPortNum",
        wiredMAC: 'MACAddress'
    },
    SwitchPortNum: 'byte'
}


const WRONG_PORT_NUM = SwitchPortNum(255)
class Switch {
    constructor() {
        this.ports = '[]SwitchPortNum',
        this.mapping = '[]MACAddress'
    }
    Init() {
        p = awaitPort()
        if (p.isBroadcasting()) {
            sw.ports[0].send(p)
            return
        }
    }
    resolve(destMACAddress)(SwitchPortNum) {
        for n, mac: = range sw.mapping {
            if mac == dest {
                return SwitchPortNum(n), true
            }
        }

        return WRONG_PORT_NUM, false
    }
    send() {

    }
}

class Network {
    // swtch  Switch
    // router Router
}

type Fibre chan byte

// PHY represents physical WHY socket
type PHY struct {
	tx Fibre
	rx Fibre
}

func (y *PHY) transmit(data byte) {
	y.tx <- data
}

func (y *PHY) receive(a chan byte) {
	d := <-y.rx
	a <- d
}


class Device  {
    send(ip, port, data) {
    }
    listen(port) {
    }
}

class Adapter {
	// phy PHY
    // mac MACAddress
    Attach(wire) {
        w.phy = a.phy
    }
    Init() {
        a.send(MAC_BROADCAST_ADDR, nil)
    }
    send(destMACAddress, dataBytes) {
        p = struct.DataLinkPacket({
            dest:   dest,
            source: a.mac,
            data:   data,
        })
        a.phy.transmit(p.asBytes())
    }
}
// type RJ32 *PHY

// Wire represents physical wire cable
class Wire  {
	// j0 RJ32
    // j1 RJ32
    Attach(phy0, phy1) {
        w.j0 = phy0
        w.j1 = phy1
        w.j0.rx = w.j1.tx
        w.j1.rx = w.j0.tx
    }
    Detach() {
        w.j0.rx = nil
        w.j1.rx = nil
        w.j0 = nil
        w.j1 = nil
    }
}

/**
*
func (r *Router) send(p TCPPacket) {
    
}
  Socket socket = getSocket(= "TCP")
 connect(socket, address = "1.2.3.4", port = "80")
 send(socket, "Hello, world!")
 close(socket)
*/