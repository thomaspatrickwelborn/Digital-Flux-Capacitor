import fs from "node:fs"
import https from "node:https"
import path from "node:path"
import cors from "cors"
import express from "express"
import Config from "./config/index.js"
import Pilers from "./pilers/index.js"
// Application
console.log()