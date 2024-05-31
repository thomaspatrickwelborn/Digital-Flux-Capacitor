function addedDiff($setA, $setB) {
	const added = []
	const setBLength = $setB.length
	var setBIndex = 0
	while(setBIndex < setBLength) {
		const setBElement = $setB[setBIndex]
		const isSetBElementInSetA = (
			$setA.findIndex(
				($setBElement) => $setBElement === setBElement
			) !== -1
		) ? true
		  : false
	  if(isSetBElementInSetA === false) added.push(setBElement)
		setBIndex++
	}
	return added
}

function updatedDiff($setA, $setB) {
	const updated = []
	const setBLength = $setB.length
	var setBIndex = 0
	while(setBIndex < setBLength) {
		const setBElement = $setB[setBIndex]
		const isSetBElementInSetA = (
			$setA.findIndex(
				($setAElement) => $setAElement === setBElement
			) !== -1
		) ? true
		  : false
	  if(isSetBElementInSetA === true) updated.push(setBElement)
		setBIndex++
	}
	return updated
}

function deletedDiff($setA, $setB) {
	const deleted = []
	const setALength = $setA.length
	var setAIndex = 0
	while(setAIndex < setALength) {
		const setAElement = $setA[setAIndex]
		const isSetAElementInSetB = (
			$setB.findIndex(
				($setBElement) => $setBElement === setAElement
			) !== -1
		) ? true
		  : false
	  if(isSetAElementInSetB === false) deleted.push(setAElement)
		setAIndex++
	}
	return deleted
}

function differentiateFSElements($setA, $setB) {
	return {
		added: addedDiff($setA, $setB),
		updated: updatedDiff($setA, $setB),
		deleted: deletedDiff($setA, $setB),
	}
}

export default differentiateFSElements