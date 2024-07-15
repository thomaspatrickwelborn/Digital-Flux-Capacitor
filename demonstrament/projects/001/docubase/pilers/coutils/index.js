function bufferToString(
  $buffer
)
{
  return $buffer.toString()
}
function bufferToJSON(
  $buffer
)
{
  return JSON.parse(
    $buffer.toString()
  )
}
export {
  bufferToString,
  bufferToJSON
}