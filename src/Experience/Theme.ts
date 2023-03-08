import { EventEmitter } from "events"

export default class Theme extends EventEmitter {
	public theme: string = "light"
	public toggleButton: HTMLButtonElement =
		document.querySelector<HTMLButtonElement>(".toggle-button")!
	public toggleCircle: HTMLDivElement =
		document.querySelector<HTMLDivElement>(".toggle-circle")!
	constructor() {
		super()
		this.setEventListeners()
	}

	private setEventListeners() {
		this.toggleButton.addEventListener("click", () => {
      this.toggleCircle.classList.toggle("slide")
      this.theme = this.theme === "light" ? "dark" : "light"
      document.body.classList.toggle("dark-theme")
      document.body.classList.toggle("light-theme")
      this.emit('switch', this.theme)
		})
	}
}
