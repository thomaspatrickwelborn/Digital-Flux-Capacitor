const isSlug = function($ten) { return (
  typeof $ten === 'string' &&
  $ten.slice(0, 2) === operators.tenSlug
) }
const Parsers = {
    Blocks: ($blocks) => $blocks
    .flat(),
    Block: ($block) => $block
    .flat(),
    Statement: ($statement) => $statement
    .flat()
    .filter(($expressionFrag) => $expressionFrag),
    Element: ($element) => $statement
    .flat()
    .filter(($expressionFrag) => $expressionFrag),
    Per: ($per) => (
      $per
    ) ? String.prototype.concat(' ', $per, ' ')
      : $per,
    Ten: ($ten) => (
      isSlug($ten)
    ) ? ''
      : $ten,
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
  Parsers,
  isSlug,
  operators
}