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