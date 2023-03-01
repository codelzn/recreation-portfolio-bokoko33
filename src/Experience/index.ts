import * as THREE from "three"
import Sizes from "./utils/Sizes"
import Assets from "./utils/Assets"
import Resources from "./utils/Resources"
import Camera from "./Camera"
import Renderer from "./Renderer"
import Time from "./utils/Time"
import World from "./world/World"

export default class Experience {
	private static instance: Experience
	public scene: THREE.Scene = new THREE.Scene()
	public canvas: HTMLCanvasElement
	public sizes: Sizes
	public camera: Camera
	public renderer: Renderer
	public time: Time = new Time()
	public resources: Resources
	public world: World
	private constructor() {
		this.canvas =
			document.querySelector<HTMLCanvasElement>(".experience-canvas")!
		this.sizes = new Sizes()
		this.camera = new Camera(this)
		this.renderer = new Renderer(this)
		this.resources = new Resources(Assets)
		this.world = new World(this)
		this.sizes.on("resize", () => {
			this.resize()
		})
		this.time.on("update", () => {
			this.update()
		})
	}
	public static getInstance() {
		if (!Experience.instance) {
			Experience.instance = new Experience()
		}
		return Experience.instance
	}
	private update() {
		this.camera.update()
		this.renderer.update()
	}
	private resize() {
		this.camera.resize()
		this.renderer.resize()
	}
}
