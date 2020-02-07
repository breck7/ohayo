"use strict"

;(function(exports) {
  exports.plot = function(series, cfg = undefined) {
    let min = series[0]
    let max = series[0]

    for (let i = 1; i < series.length; i++) {
      min = Math.min(min, series[i])
      max = Math.max(max, series[i])
    }

    let range = Math.abs(max - min)
    cfg = typeof cfg !== "undefined" ? cfg : {}
    let offset = typeof cfg.offset !== "undefined" ? cfg.offset : 3
    let padding = typeof cfg.padding !== "undefined" ? cfg.padding : "           "
    let height = typeof cfg.height !== "undefined" ? cfg.height : range
    let ratio = range !== 0 ? height / range : 1
    let min2 = Math.round(min * ratio)
    let max2 = Math.round(max * ratio)
    let rows = Math.abs(max2 - min2)
    let width = series.length + offset
    let format =
      typeof cfg.format !== "undefined"
        ? cfg.format
        : function(x) {
            return (padding + x.toFixed(2)).slice(-padding.length)
          }

    let result = new Array(rows + 1) // empty space
    for (let i = 0; i <= rows; i++) {
      result[i] = new Array(width)
      for (let j = 0; j < width; j++) {
        result[i][j] = " "
      }
    }
    for (let y = min2; y <= max2; ++y) {
      // axis + labels
      let label = format(rows > 0 ? max - ((y - min2) * range) / rows : y, y - min2)
      result[y - min2][Math.max(offset - label.length, 0)] = label
      result[y - min2][offset - 1] = y == 0 ? "┼" : "┤"
    }

    let y0 = Math.round(series[0] * ratio) - min2
    result[rows - y0][offset - 1] = "┼" // first value

    for (let x = 0; x < series.length - 1; x++) {
      // plot the line
      let y0 = Math.round(series[x + 0] * ratio) - min2
      let y1 = Math.round(series[x + 1] * ratio) - min2
      if (y0 == y1) {
        result[rows - y0][x + offset] = "─"
      } else {
        result[rows - y1][x + offset] = y0 > y1 ? "╰" : "╭"
        result[rows - y0][x + offset] = y0 > y1 ? "╮" : "╯"
        let from = Math.min(y0, y1)
        let to = Math.max(y0, y1)
        for (let y = from + 1; y < to; y++) {
          result[rows - y][x + offset] = "│"
        }
      }
    }

    return result
      .map(function(x) {
        return x.join("")
      })
      .join("\n")
  }
})(typeof exports === "undefined" ? /* istanbul ignore next */ (this["asciichart"] = {}) : exports)
