import Room from "./Room"
import Floor from "./Floor"
import Environment from "./Environment"
import Controls from "./Controls"
import Experience from ".."
import Resources from "../utils/Resources"
import Theme from "../Theme"
export default class World {
	public room?: Room
	public floor?: Floor
	private environment?: Environment
	private resources: Resources
	// private controls?: Controls
	private theme: Theme
	constructor(private readonly experience: Experience) {
		this.resources = this.experience.resources
		this.theme = this.experience.theme
		this.resources.on("ready", () => {
			this.environment = new Environment(this.experience)
			this.floor = new Floor(this.experience)
			this.room = new Room(this.experience)
			new Floor(this.experience)
			// this.controls = new Controls(this.experience)
			new Controls(this.experience)
		})
		this.theme.on("switch", (theme: "light" | "dark") => {
			this.switchTheme(theme)
		})
	}
	private switchTheme(theme: "light" | "dark") {
		if (this.environment) {
			this.environment.switchTheme(theme)
		}
	}
	public resize() {}
	public update() {
		if (this.room) {
			this.room.update()
		}
	}
}
