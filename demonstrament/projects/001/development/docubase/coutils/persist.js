class Persist{
  #interval
  #intervalDuration = 1 << 30
  #intervalFunction = () => {}
  start(){
    this.#interval = setInterval(
      this.#intervalFunction,
      this.#intervalDuration
    )
  }
  stop(){
    clearInterval(
      this.#interval
    )
  }
}