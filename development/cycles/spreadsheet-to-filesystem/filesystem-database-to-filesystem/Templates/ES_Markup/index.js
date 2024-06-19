import Blocks from './Blocks/index.js'
export default function ES_Markup($data) {
  const { coutils, content } = $data
  console.log(this.name, content)
  // <%- await include('../coutil/es/imports/index.ejs', {
  //   content: content.imports,
  //   coutils: coutils,
  // }) -%>
  // // <%# BLOCKS -%>
  // <%- await include('blocks/index.ejs', {
  //   content: content.blocks,
  //   coutils: coutils,
  // }) -%>
  // // <%# EXPORTS -%>
  // <%- await include('../coutil/es/exports/index.ejs', {
  //   content: content.exports,
  //   coutils: coutils,
  // }) -%>
}