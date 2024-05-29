const operators = {
  closure: ["{}", "[]", "()", "<>"],
  assignment: [":", "?", "=", "+=", "-=", "++", "--"],
  mathematical: ["+", "-", "*", "/", "%"],
  comparison: ["<", ">", "<=", "=>", "==", "!=","===", "!=="],
  operatorTypes: ['closure', 'assignment', 'mathematical', 'comparison'],
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
export default operators