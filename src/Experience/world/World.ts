import Room from "./Room"
import Environment from "./Environment"
import Controls from "./Controls"
import Experience from ".."
import Resources from "../utils/Resources"
export default class World {
	private room?: Room
	private environment?: Environment
	private resources: Resources
	private controls?: Controls
	constructor(private readonly experience: Experience) {
		this.resources = this.experience.resources
		this.resources.on("ready", () => {
			this.environment = new Environment(this.experience)
			this.room = new Room(this.experience)
			this.controls = new Controls(this.experience)
		})
	}
	public resize() {}
	public update() {
		if (this.room) {
			this.room.update()
		}
		if (this.controls) {
			this.controls.update()
		}
	}
}
