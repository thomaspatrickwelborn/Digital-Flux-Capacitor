import https from "node:https"
import path from "node:path"
import cors from "cors"
import express from "express"
import RollupConfig from "./rollup.config.js"
import SASSConfig from "./sass.config.js"
import EJSConfig from "./ejs.config.js"
import Pilers from "./pilers/index.js"
// Application
const rollupPiler =  new Pilers.Rollup(
  RollupConfig
)
// await rollupPiler.start()
console.log(
  'rollupPiler', rollupPiler
)
const sassPiler =  new Pilers.SASS(
  SASSConfig
)
await sassPiler.start()
console.log(
  'sassPiler', sassPiler
)