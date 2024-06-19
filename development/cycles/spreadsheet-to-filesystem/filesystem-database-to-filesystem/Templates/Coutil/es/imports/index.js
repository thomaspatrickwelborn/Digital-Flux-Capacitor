export default function Imports($data) {
  const imports = $data.content
  // %>
  // <% for(const $import of imports) { -%>
  //   <% if($import.default === false) { -%>
  //     import {
  //       <% var namedImportIndex = 0 -%>
  //       <% for(const $namedImport of $import.name) { -%>
  //         <% if($namedImport.alias !== undefined) { -%>
  //           <% if(namedImportIndex < $import.name.length - 1) { -%>
  //             <%= $namedImport.name -%> as <%= $namedImport.alias -%>,
  //           <% } else { -%>
  //             <%= $namedImport.name -%> as <%= $namedImport.alias -%>
  //           <% } -%>
  //         <% } else { -%>
  //           <% if(namedImportIndex < $import.name.length - 1) { -%>
  //             <%= $namedImport.name -%>,
  //           <% } else { -%>
  //             <%= $namedImport.name -%>
  //           <% } -%>
  //         <% } -%>
  //         <% namedImportIndex++ %>
  //       <% } -%>
  //     } from '<%= $import.path -%>'
  //   <% } else if($import.default === true) { -%>
  //     <% const namedImport = $import.name[0] -%>
  //     <% if(namedImport !== undefined) { -%>
  //       <% if(namedImport.alias !== undefined) { -%>
  //         import <%= namedImport.name -%> as <%= namedImport.alias -%> from '<%= $import.path -%>'
  //       <% } else { -%>
  //         import <%= namedImport.name -%> from '<%= $import.path -%>'
  //       <% } -%>
  //     <% } -%>
  //   <% } -%>
  // <% } -%>
}