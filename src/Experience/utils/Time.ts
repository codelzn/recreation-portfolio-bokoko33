import { EventEmitter } from 'events'

export default class Time extends EventEmitter  {
  public start: number = Date.now()
  public current: number = this.start
  public elapsed: number = 0
  public delta: number = 16
  constructor() {
    super()
    this.update()
  }

  private update() {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start
    this.emit('update')
    window.requestAnimationFrame(this.update.bind(this))

  }
}