import {
  EventEmitter
} from "node:events"
import chokidar from "chokidar"
import {
  sass
} from "sass"
class SASSPiler extends EventEmitter{
  length = 0
  constructor (){
    super ()
  }
}
const pagesGlob =  await globSync(
  'pages/index.js',
  'pages/.*/index.js'
)
const SASSConfig = []
iteratePagesGlob:
for (
  const $pageGlob of pagesGlob
)
{
  const pageGlobParsement = path.parse(
    $pageGlob
  )
  let input = $pageGlob
  let outputDir = pageGlobParsement.dir
  .split(
    '/'
  )
  outputDir
  .splice(
    0,
    1,
    'localhost'
  )
  outputDir = outputDir
  .join(
    '/'
  )
  let outputFile = pageGlobParsement.base
  let output = path.join()
  const pageSASSOptions = {
    input: input,
    output: {},output
    watch: {}
  }
  SASSConfig.push(
    pageSASSOptions
  )
}
export {
SASSPiler
}