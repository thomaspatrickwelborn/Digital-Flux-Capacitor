import fs from "node:fs"
import https from "node:https"
import path from "node:path"
import cors from "cors"
import express from "express"
import RollupConfig from "./rollup.config.js"
import SASSConfig from "./sass.config.js"
import EJSConfig from "./ejs.config.js"
import Pilers from "./pilers/index.js"
// Application
console.log(
  RollupConfig, EJSConfig, SASSConfig, Pilers
)