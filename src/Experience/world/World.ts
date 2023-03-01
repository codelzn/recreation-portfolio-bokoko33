import Sizes from "../utils/Sizes"
import Camera from "../Camera"
import Room from "./Room"
import Environment from "./Environment"
import * as THREE from "three"
import Experience from ".."
import Resources from "../utils/Resources"
export default class World {
	private sizes: Sizes
	private canvas: HTMLCanvasElement
	private scene: THREE.Scene
	private camera: Camera
  private room?: Room
  private environment?: Environment
	private resources: Resources
	constructor(private readonly experience: Experience) {
		this.sizes = this.experience.sizes
		this.canvas = this.experience.canvas
		this.scene = this.experience.scene
		this.camera = this.experience.camera
		this.resources = this.experience.resources
    this.resources.on("ready", () => {
      this.environment = new Environment(this.experience)
			this.room = new Room(this.experience)
		})
	}
	public resize() {}
	public update() {}
}
