import path from "node:path"
import {
  globSync
} from "glob"
const pagesGlob =  await globSync(
  [
    'develop/pages/index.scss',
    'develop/pages/.*/index.scss'
  ]
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
  const input = $pageGlob
  let outputDir = pageGlobParsement.dir
  .split(
    '/'
  )
  outputDir
  .splice(
    0,
    2,
    'distribute',
    'localhost'
  )
  outputDir = outputDir
  .join(
    '/'
  )
  const output = path.join(
    outputDir,
    String.prototype.concat(
      pageGlobParsement.name,
      '.css'
    )
  )
  const watch = {}
  const pageSASSOptions = {
    input , 
    output , 
    watch: {
      chokidar: {}
    },
    formatter: {
      prettier: {
        semi: false,
        parser: "scss"
      }
    }
  }
  SASSConfig.push(
    pageSASSOptions
  )
}
export default SASSConfig