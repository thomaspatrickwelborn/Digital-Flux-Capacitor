import RollupPiler from "./piler.js"
import SASSPiler from "./sass.js"
import EJSPiler from "./ejs.js"
const Pilers = {
  SASS: SASSPiler , 
  EJS: EJSPiler , 
  Rollup: RollupPiler
}
export default Pilers