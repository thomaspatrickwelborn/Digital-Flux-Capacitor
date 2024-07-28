export default function transformCollectDocPort($ports) {
  const portsLength = $ports?.length
  if(!portsLength) return $ports
  var portsIndex = 0
  iteratePorts:
  while(portsIndex < portsLength) {
    const port = $ports[portsIndex]
    const portNames = []
    const portNamesData = port?.name?.split('\n') || []
    const portNamesDataLength = portNamesData.length
    var portNamesDataIndex = 0
    iteratePortNamesData: 
    while(portNamesDataIndex < portNamesDataLength) {
      const portNameData = portNamesData[portNamesDataIndex].split(' ')
      if(portNameData.length === 1) {
        portNames.push({
          name: portNameData[0]
        })
      } else if(
        portNameData.length === 3 &&
        portNameData[1] === 'as'
      ) {
        portNames.push({
          name: portNameData[0],
          alias: portNameData[2],
        })
      }
      portNamesDataIndex++
    }
    port.name = portNames
    $ports[portsIndex] = port
    portsIndex++
  }
  return $ports
}