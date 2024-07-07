import {
  globSync
} from "glob"
import path from "node:path"
const pagesGlob =  await globSync(
  'pages/index.js',
  'pages/.*/index.js'
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
  let outputDir = pageGlobParsement.dir
  .split(
    '/'
  )
  .splice(
    0,
    1,
    'localhost'
  )
  let outputFile = pageGlobParsement.file
  let outputFormat = 'es'
  const pageRollupOptions = {
    input: $pageGlob,
    output: {
      dir: outputDir,
      file: outputFile,
      format: outputFormat
    }
  }
  RollupConfig.push(
    pageRollupOptions
  )
}
export default RollupConfig