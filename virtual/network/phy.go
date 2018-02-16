package network

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
