import {
  EventEmitter
} from "node:events"
import chokidar from "chokidar"
import ejs from "ejs"
class EJSPiler extends EventEmitter{
  length = 0
  constructor (){
    super ()
  }
}
export {
  EJSPiler
}