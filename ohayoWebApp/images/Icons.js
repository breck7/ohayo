const SVGS = require("./SVGS.js")

function Icons(name, size) {
  const rawSvg = SVGS[name]
  const svg = rawSvg.substr(4)
  const prefix = `<svg width="${size}" height="${size}" class="SVGIcon" `
  return prefix + svg
}

module.exports = Icons
