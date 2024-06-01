export default class Merges extends EventTarget {
  #settings = {}
  #options = {}
  #hidden = {}
  merges = []
  constructor($settings = {}, $options = {}) {
    super()
    this.#settings = $settings
    this.#options = $options
    this.#hidden = this.#options.hidden
  }
  #getMerges($options = Defaults.GetMergesOptions) {
    const { includeHidden } = $options
    if(includeHidden === true) return this.merges
    const merges = []
    const mergesLength = this.merges.length
    var mergesIndex = 0
    while(mergesIndex < mergesLength) {
      const merge = structuredClone(this.merges[mergesIndex])
      if(includeHidden === false) {
        const hidden = this.#hidden
        const hiddenRows = hidden.rows
        const hiddenRowsLength = hiddenRows.length
        const hiddenCols = hidden.cols
        const hiddenColsLength = hiddenCols.length
        var hiddenRowsIndex = 0
        while(hiddenRowsIndex < hiddenRowsLength) {
          const $hiddenRowIndex = hiddenRows[hiddenRowsIndex]
          if($hiddenRowIndex < merge.s.r) {
            if(merge.s.r - 1 < 0) {
              if(merge.e.r - 1 < 0) {
                merge.s.r = -1
                merge.e.r = -1
              } else {
                merge.s.r = 0
                merge.e.r -= 1
              }
            } else {
              merge.s.r -= 1
              merge.e.r -= 1
            }
          } else if(
            $hiddenRowIndex >= merge.s.r &&
            $hiddenRowIndex <= merge.e.r
          ) {
            if(merge.e.r - 1 < merge.s.r) {
              merge.s.r = -1
              merge.e.r = -1
            } else {
              merge.e.r -= 1
            }
          }
          hiddenRowsIndex++
        }
        var hiddenColsIndex = 0
        while(hiddenColsIndex < hiddenColsLength) {
          const $hiddenColIndex = hiddenCols[hiddenColsIndex]
          if($hiddenColIndex < merge.s.c) {
            if(merge.s.c - 1 < 0) {
              if(merge.e.c - 1 < 0) {
                merge.s.c = -1
                merge.e.c = -1
              } else {
                merge.s.c = 0
                merge.e.c -= 1
              }
            } else {
              merge.s.c -= 1
              merge.e.c -= 1
            }
          } else if(
            $hiddenColIndex >= merge.s.c &&
            $hiddenColIndex <= merge.e.c
          ) {
            if(merge.e.c - 1 < merge.s.c) {
              merge.s.c = -1
              merge.e.c = -1
            } else {
              merge.e.c -= 1
            }
          }
          hiddenColsIndex++
        }
        if((
          merge.s.r !== -1 &&
          merge.e.r !== -1
        ) && (
          merge.s.c !== -1 &&
          merge.e.c !== -1
        )) merges.push(merge)
      } else {
        merges.push(merge)
      }
      mergesIndex++
    }
    return merges
  }
  #setMerges($merges) {
    this.merges = $merges
    Object.freeze(this.merges)
    return this.#getMerges()
  }
}