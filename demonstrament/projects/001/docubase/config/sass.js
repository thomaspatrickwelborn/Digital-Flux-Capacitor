import path from "node:path"
import {
  globSync
} from "glob"
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
  let outputFormat = 'es'
  const pageSASSOptions = {
    input: input,
    output: {
      dir: outputDir,
      // file: outputFile,
      format: outputFormat
    },
    watch: {
      chokidar: {}
    }
  }
  SASSConfig.push(
    pageSASSOptions
  )
}
export default SASS