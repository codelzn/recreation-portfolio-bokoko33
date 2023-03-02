import * as THREE from "three"
import gsap from "gsap"
import Experience from ".."
import Room from "./Room"
import { ScrollTrigger } from "gsap/ScrollTrigger"
export default class Controls {
	private scene: THREE.Scene
  private orthographicCamera?: THREE.OrthographicCamera
  private timeline?: gsap.core.Timeline
  private room: THREE.Object3D
	constructor(private readonly experience: Experience) {
    this.scene = this.experience.scene
    this.room = this.experience.world.room!.actualRoom
    this.orthographicCamera = this.experience.camera.orthographicCamera
    gsap.registerPlugin(ScrollTrigger)
    document.querySelector<HTMLDivElement>(".page")!.style.overflow = "visible";
    this.setPath()
	}
  private setPath() {
    this.timeline = gsap.timeline()
  }
	public resize() {}
	public update() {
	}
}
