export default function Exports($data) {
  const _exports = $data.content
  // <% for(const $export of _exports) { -%>
  //   <% if($export.default !== true) { -%>
  //     <%
  //     let nameIndex = 0
  //     const nameLength = $export.nameLength
  //     -%>
  //     export {
  //     <% for(const $name of $export.name ) { -%>
  //       <% const name = $name.name %>
  //       <% if(nameIndex < nameLength - 1) { -%>
  //         <%= name %>,
  //       <% } else { -%>
  //         <%= name %>
  //       <% } -%>
  //       <% nameIndex++ -%>
  //     <% } -%>
  //     }
  //   <% } else { -%>
  //     export default <%= $export.name[0].name -%>
  //   <% } -%>
  // <% } -%>
}