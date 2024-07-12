import path from "node:path"
import {
  globSync
} from "glob"
const pagesGlob =  await globSync(
  'develop/pages/index.js',
  'develop/pages/.*/index.js'
)
console.log(
  'pagesGlob', pagesGlob
)
const RollupConfig = []
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
  const pageRollupOptions = {
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
  RollupConfig.push(
    pageRollupOptions
  )
}
export default RollupConfig