import * as THREE from "three"
import Experience from ".."
export default class Floor {
	private scene: THREE.Scene
	private geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(100, 100)
	private material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial(
		{
			color: 0xffffff,
		}
	)
	private plane: THREE.Mesh = new THREE.Mesh(this.geometry, this.material)
	constructor(private readonly experience: Experience) {
		this.scene = this.experience.scene
		this.setFloor()
	}
  private setFloor() {
    this.scene.add(this.plane)
    this.plane.rotation.x = -Math.PI / 2
    this.plane.position.y = -0.3
    this.plane.receiveShadow = true
  }
	public resize() {}
	public update() {}
}
