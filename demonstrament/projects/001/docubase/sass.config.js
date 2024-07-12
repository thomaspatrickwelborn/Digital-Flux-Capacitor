import path from "node:path"
import {
  globSync
} from "glob"
const pagesGlob =  await globSync(
  'develop/pages/index.sass',
  'develop/pages/.*/index.sass'
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
export default SASSConfig