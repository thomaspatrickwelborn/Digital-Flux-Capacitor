export default function Statement($data) {
  const { coutils, content } = $data
  const { operators, parseTen } = coutils
  const { blocks, statement } = content
  // if(statement === undefined) return
  // const { lexter, dexter } = statement
  // const expressions = [lexter, dexter]
  // var expressionsIndex = 0
  // iterateExpressions:
  // while(expressionsIndex < expressions.length) {
  //   const expression = expressions[expressionsIndex]
  //   if(expression === undefined) {
  //     expressionsIndex++
  //     continue iterateExpressions
  //   }
  //   var { ser, ten, per, pos, par } = expression
  //   pos = pos || {}
  //   const inpos = pos.in
  //   const expos = pos.ex
  //   -%>
  //   <%- ser %> <%- parseTen(ten) %> <%- per %> <%- inpos %>
  //   <%- await include('../../index.ejs', {
  //       content: blocks,
  //       coutils: coutils,
  //   }) %>
  //   <%- expos %><%- par %>
  //   <% expressionsIndex++ -%>
  // <% } -%>
}