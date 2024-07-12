[object Object] = require("node:path")
 {
  globSync
} = require("glob")
const pagesGlob =  await globSync(
  'pages/index.js',
  'pages/.*/index.js'
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
module.exports = EJS