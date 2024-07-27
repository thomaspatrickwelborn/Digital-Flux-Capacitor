const settings = {
  t: 's',
  v: '',
}
export default class Cell {
  constructor($settings) {
    $settings = Object.assign(settings, $settings)
    this.t = $settings.t
    this.v = $settings.v
    return JSON.parse(JSON.stringify(this))
  }
}