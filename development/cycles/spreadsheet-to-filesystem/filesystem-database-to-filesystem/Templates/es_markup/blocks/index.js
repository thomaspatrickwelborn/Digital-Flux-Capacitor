export default function Blocks($data) {
  const { coutils, content } = $data
  iterateBlocks:
  for(let $block of content) { -%>
    // <%- await include('block/index.ejs', {
    //   content: $block,
    //   coutils: coutils,
    // }) -%>
  }
}