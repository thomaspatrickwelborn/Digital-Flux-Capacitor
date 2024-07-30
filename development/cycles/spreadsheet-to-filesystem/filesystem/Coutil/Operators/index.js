const Operators = {
  scope: [
    '{', '}', '[', ']', 
    '(', ')', '<', '>', 
    '`'
  ],
  scriptInscope: [
    '{', '[', '('
  ],
  scriptExscope: [
    '}', ']', ')'
  ],
  ejsTags: [
    '<%', '%>',
    '<%_', '_%>',
    '<%-', '-%>',
    '<%=', '<%%', '<%#' 
  ],
  assignment: [
    ':', '?', '=', '+=', '-=', '++', '--'
  ],
  assignmentShort: [
    ':'
  ],
  mathematical: [
    '+', '-', '*', '/', '%'
  ],
  comparison: [
    '<', '>', '<=', '=>', '==', '!=', '===', '!=='
  ],
  comment: [
    '//', '/*', '*/'
  ],
  operatorTypes: [
    'scope', 'assignment', 'mathematical', 'comparison'
  ],
  void: [
    'area', 'base', 'br', 'col',
    'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source',
    'track', 'wbr', '!DOCTYPE', 'DOCTYPE'

  ],
  tenSlug: ':#',
  getType: function($operator) {
    var operatorType
    for(const $operatorType of this.operatorTypes) {
      const operatorTypeIndex = this[$operatorType].findIndex(
        ($operatorString) => $operator === $operatorString
      )
      if(operatorTypeIndex !== -1) {
        operatorType = $operatorType
        break
      }
    }
    return operatorType
  },
}
export default Operators

/*
Control flow

return
break
continue
throw
if...else
switch
try...catch

Declaring variables
var
let
const

Functions and classes
function
function*
async function
async function*
class

Iterations
do...while
for
for...in
for...of
for await...of
while

Others
export
import

*/