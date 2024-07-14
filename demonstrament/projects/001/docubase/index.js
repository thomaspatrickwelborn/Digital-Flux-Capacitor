import https from "node:https"
import path from "node:path"
import cors from "cors"
import express from "express"
import RollupConfig from "./rollup.config.js"
import SASSConfig from "./sass.config.js"
import EJSConfig from "./ejs.config.js"
import Pilers from "./pilers/index.js"
const rollupPiler =  new Pilers.Rollup(
  RollupConfig
)
rollupPiler.start()
const sassPiler =  new Pilers.SASS(
  SASSConfig
)
sassPiler.start()
const ejsPiler =  new Pilers.EJS(
  EJSConfig
)
ejsPiler.start()
console.log(
  ejsPiler
)