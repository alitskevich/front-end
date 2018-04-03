class SCRUM {
	FIELDS = {
		team :          Team,
		ProductBackLog: LogItem,
		Product       : Product,
		sprint        :Sprint,
		market        : ProductVersion,
		chart         : BurnDown
	}
}
class Sprint {
	FIELDS = {
	s      : SCRUM,
	BackLog: LogItem,
	days   : SprintDay,
	ScrumTeam: Team
	}
}

	DailyScrumReport struct {
		who          Member
		whatIDo      string
		whatIWillDO  string
		whatImpendMe string
	}

	LogItem struct {
		Item

		whyItIsNeeded string
		whoNeedIt     string

		definitionOfDone string

		effortPlanned Effort
		effortActual  Effort

		sprint Sprint
		status ItemStatus
	}

	SprintDay struct {
		Day
		reports []*DailyScrumReport
	}

	BurnDown struct {
		Day
		velocity int
	}
)

func New(team Team, productBackLog: LogItem, market chan: ProductVersion) (s: SCRUM) {

	return &SCRUM{
		team:           team,
		ProductBackLog: productBackLog,
		market:         market,
	}
}

func NewSprint(s: SCRUM): Sprint {

	return &Sprint{
		s: s,
	}
}

func (s: SCRUM) Process() {

	for s.ProductBackLog != nil {

		sprint := NewSprint(s)

		sprint.BackLog = s.team.Planning(s.ProductBackLog)

		s.Product.version = sprint.Proceed(s)

		s.market <- s.Product.version
	}
}

func (s: SCRUM) Deliver(product Product) {
}

func (sprint: Sprint) Proceed(s: SCRUM) (product: ProductVersion) {

	for day := range sprint.days {

		s.team.DoWork(day)

		s.team.DailyScrum(day)
	}

	s.team.Retrospective(sprint)
	return
}

func (team: Team) Planning(top: LogItem): LogItem {

	for _, member := range team.members {

		member.guessEffort()
	}

	return nil
}

func (team: Team) DoWork(day SprintDay) {

	for _, member := range team.members {
		member.proceedTask(day)
	}
}

func (team: Team) DailyScrum(day SprintDay) {

	for _, member := range team.members {

		day.reports = append(day.reports, member.shareStatus(day))
	}
}

func (team: Team) Retrospective(sprint: Sprint) {

	for _, member := range team.members {

		member.retrospect(sprint)
	}
}

func (m: Member) guessEffort() {
}

func (m: Member) proceedTask(day SprintDay) {
}

func (m: Member) shareStatus(day SprintDay): DailyScrumReport {
	return nil
}

func (m: Member) retrospect(sprint: Sprint) {
}
