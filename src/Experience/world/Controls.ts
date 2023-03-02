import * as THREE from "three"
import Experience from ".."
import Time from "../utils/Time"
import Resources from "../utils/Resources"
export default class Controls {
	private scene: THREE.Scene
	private time: Time
	private resources: Resources
	private curve?: THREE.CatmullRomCurve3
	private dummyVector: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
	private orthographicCamera?: THREE.OrthographicCamera
	public process: number = 0
	constructor(private readonly experience: Experience) {
		this.scene = this.experience.scene
		this.time = this.experience.time
		this.resources = this.experience.resources
		this.orthographicCamera = this.experience.camera.orthographicCamera
    this.setPath()
    this.onWheel()
	}
	private setPath() {
		this.curve = new THREE.CatmullRomCurve3(
			[
				new THREE.Vector3(-10, 0, 10),
				new THREE.Vector3(-5, 5, 5),
				new THREE.Vector3(0, 0, 0),
				new THREE.Vector3(5, -5, 5),
				new THREE.Vector3(10, 0, 10),
			],
			true
		)

		const points = this.curve.getPoints(50)
		const geometry = new THREE.BufferGeometry().setFromPoints(points)

		const material = new THREE.LineBasicMaterial({ color: 0xff0000 })

		const curveObject = new THREE.Line(geometry, material)
		this.scene.add(curveObject)
  }
  private onWheel() {}

	public resize() {}
	public update() {
    this.curve?.getPointAt(this.process % 1, this.dummyVector)
    this.process -= 0.01
    if (this.process < 0) {
      this.process = 1
    }
		this.orthographicCamera?.position.copy(this.dummyVector)
	}
}
