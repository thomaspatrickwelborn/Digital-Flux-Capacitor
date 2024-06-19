export default function Element($data) {
  const { coutils, content } = $data
  const { blocks, element } = content
  const { operators, parseTen } = coutils
  const _element = []
  // if(element === undefined) return
  // const {
  //   tag, attribute, text, data
  // } = element
  // if(tag === undefined) return
  // var { pos } = tag
  // pos = pos || {}
  // const inpos = pos.in
  // const expos = pos.ex
  // -%>
  // <%- inpos %><%- parseTen(tag.name) %>
  // <%
  // iterateAttributes:
  // for(const $attribute of attribute) {
  // -%>
  //   <%
  //   if(
  //     $attribute.key !== undefined &&
  //     $attribute.ten !== undefined &&
  //     $attribute.ten !== operators.tenSlug
  //   ) { -%>
  //     <%- $attribute.key %>="<%- $attribute.ten %>"
  //   <% } else
  //   if(
  //     $attribute.key !== undefined &&
  //     $attribute.ten === undefined
  //   ) { -%>
  //     <%- $attribute.key %>
  //   <% } else
  //   if(
  //     $attribute.key === undefined &&
  //     $attribute.ten !== undefined &&
  //     $attribute.ten !== operators.tenSlug
  //   ) { -%>
  //     <%- $attribute.ten %>
  //   <% } -%>
  // <% } -%>
  // <%- expos %>
  // <% if(blocks.length) { -%>
  //   <%- await include('../../index.ejs', {
  //     content: blocks,
  //     coutils: coutils,
  //   }) %>
  // <% } -%>
  // <% if(
  //   !operators.void.includes(tag.name)
  // ) { -%>
  //   <%- inpos %>/<%- parseTen(tag.name) %><%- expos %>
  // <% } -%>
  return _element
}