import {
  EventEmitter
} from "node:events"
import digital-flux-capacitor from "digital-flux-capacitor"
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
export default DFC