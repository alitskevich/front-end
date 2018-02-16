package network

type RJ32 *PHY

// Wire represents physical wire cable
type Wire struct {
	j0 RJ32
	j1 RJ32
}

func (w *Wire) Attach(phy0 PHY, phy1 PHY) {
	w.j0 = &phy0
	w.j1 = &phy1
	w.j0.rx = w.j1.tx
	w.j1.rx = w.j0.tx
}

func (w *Wire) Detach() {
	w.j0.rx = nil
	w.j1.rx = nil
	w.j0 = nil
	w.j1 = nil
}
