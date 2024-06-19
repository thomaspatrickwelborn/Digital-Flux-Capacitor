
export default function ES_Markup($data) {
  const { coutils, content } = $data
  const { blocks, imports, exports } = content
  // <%- await include('../coutil/es/imports/index.ejs', {
  //   content: imports,
  //   coutils: coutils,
  // }) -%>
  // <%# BLOCKS -%>
  // <%- await include('blocks/index.ejs', {
  //   content: blocks,
  //   coutils: coutils,
  // }) -%>
  // <%# EXPORTS -%>
  // <%- await include('../coutil/es/exports/index.ejs', {
  //   content: exports,
  //   coutils: coutils,
  // }) -%>
}