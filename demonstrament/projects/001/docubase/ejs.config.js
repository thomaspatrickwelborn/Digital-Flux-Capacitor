import path from "node:path"
import {
  globSync
} from "glob"
const pagesGlob =  await globSync(
  'pages/develop/index.ejs',
  'pages/develop/.*/index.ejs',
  'pages/develop/.*/index.json',
  'pages/develop/.*/index.json'
)
const EJSConfig = []
iteratePagesGlob:
for (
  const $pageGlob of pagesGlob
)
{
  const pageGlobParsement = path.parse(
    $pageGlob
  )
  console.log(
    pageGlobParsement
  )
  let input = $pageGlob
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
  let outputFile = pageGlobParsement.base
  let outputFormat = 'es'
  const pageEJSOptions = {
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
  EJSConfig.push(
    pageEJSOptions
  )
}
export default EJSConfig