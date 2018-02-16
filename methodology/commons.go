package methodology

type (
	ProductVersion struct {
		version      string
		releaseNotes []string
	}

	Product struct {
		version *ProductVersion
	}

	Team struct {
		members []Member
	}

	MemberRole string

	Member struct {
		name string
		role MemberRole
	}

	Item struct {
		name             string
		typ              string

		status           ItemStatus
	}

	Day struct {
		index int
		date string
	}

	Effort struct {
		amount  int
		measure EffortMeasure
	}

	ItemStatus string
	EffortMeasure string
)
