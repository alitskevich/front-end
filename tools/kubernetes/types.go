package kubernetes

type Pod struct {
	containers []Container
	endpoint   Endpoint
	volumes    []Volume
}

type Deployment struct {
}

type Service struct {
}

type Container struct {
}

type Volume struct {
}

type Endpoint struct {
}

type Master struct {
}

type Worker struct {
}

type Cluster struct {
}
