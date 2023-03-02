import { EventEmitter } from "events";

export default class Sizes extends EventEmitter {
	public width: number = window.innerWidth
	public height: number = window.innerHeight
	public aspect: number = this.width / this.height
  public pixelRatio: number = Math.min(window.devicePixelRatio, 2)
  public frustum: number = 5
  constructor() {
    super()
		window.addEventListener("resize", () => {
			this.width = window.innerWidth
			this.height = window.innerHeight
      this.aspect = this.width / this.height
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)
      this.emit("resize")
		})
	}
}
