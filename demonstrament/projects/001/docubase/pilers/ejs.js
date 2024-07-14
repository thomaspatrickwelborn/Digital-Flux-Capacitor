import fs from "node:fs/promises"
import path from "node:path"
import ejs from "ejs"
import Piler from "./piler.js"
class EJSPiler extends Piler{
  length = 0
  constructor (){
    super ()
  }
}
export default EJSPiler