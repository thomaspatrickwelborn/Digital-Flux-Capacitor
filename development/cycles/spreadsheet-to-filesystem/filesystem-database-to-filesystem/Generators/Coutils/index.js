const isSlug = function($ten) { return (
  typeof $ten === 'string' &&
  $ten.slice(0, 2) === operators.tenSlug
) }
const parseTen = function($ten) {
  return (
    isSlug($ten)
  ) ? ''
    : $ten
}
const parse = function($content, $separator) {

}
const operators = {
  scope: [
    '{', '}', '[', ']', 
    '(', ')', '<', '>', 
    '`'
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
  mathematical: [
    '+', '-', '*', '/', '%'
  ],
  comparison: [
    '<', '>', '<=', '=>', '==', '!=','===', '!=='
  ],
  comment: [
    '//', '/*', '*/'
  ],
  operatorTypes: [
    'scope', 'assignment', 'mathematical', 'comparison'
  ],
  void: [
    'area', 'base', 'br', 'col',
    'embed','hr','img','input',
    'link', 'meta', 'param', 'source',
    'track', 'wbr', '!DOCTYPE'

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
export {
  parse,
  isSlug,
  parseTen,
  operators
}