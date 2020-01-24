const lodash = require("lodash")

class TileDimension {
  constructor(tile, obj) {
    const suggestedSize = tile.getSuggestedSize()
    this.width = suggestedSize.width
    this.height = suggestedSize.height
    Object.assign(this, obj) // allow overrides.
  }

  getScaledCss(factor = 1) {
    return this._toCss({
      width: this.width * factor,
      height: this.height * factor,
      left: this.left * factor,
      top: this.top * factor
    })
  }

  get right() {
    return this.width + (this.left || 0)
  }

  get bottom() {
    return this.height + (this.top || 0)
  }

  toCss() {
    return this._toCss(this)
  }

  _toCss(obj) {
    return `width: ${obj.width}px; height: ${obj.height}px; left: ${obj.left}px; top: ${obj.top}px`
  }
}

class BinPacker {
  fit(tiles) {
    const len = tiles.length
    const width = len > 0 ? tiles[0].width : 0
    const height = len > 0 ? tiles[0].height : 0
    this.root = { xcc: 0, ycc: 0, width: width, height: height }
    for (let index = 0; index < len; index++) {
      const tile = tiles[index]
      const node = this.findNode(this.root, tile.width, tile.height)
      tile.fit = node ? this.splitNode(node, tile.width, tile.height) : this.growNode(tile.width, tile.height)
    }
  }

  findNode(root, width, height) {
    if (root.used) return this.findNode(root.right, width, height) || this.findNode(root.down, width, height)

    return width <= root.width && height <= root.height ? root : null
  }

  splitNode(node, width, height) {
    node.used = true
    node.down = { xcc: node.xcc, ycc: node.ycc + height, width: node.width, height: node.height - height }
    node.right = { xcc: node.xcc + width, ycc: node.ycc, width: node.width - width, height: height }
    return node
  }

  growNode(width, height) {
    const rootNode = this.root
    const canGrowDown = width <= rootNode.width
    const canGrowRight = height <= rootNode.height

    const shouldGrowRight = canGrowRight && rootNode.height >= rootNode.width + width // attempt to keep square-ish by growing right when height is much greater than width
    const shouldGrowDown = canGrowDown && rootNode.width >= rootNode.height + height // attempt to keep square-ish by growing down  when width  is much greater than height

    if (shouldGrowRight) return this.growRight(width, height)
    else if (shouldGrowDown) return this.growDown(width, height)
    else if (canGrowRight) return this.growRight(width, height)
    else if (canGrowDown) return this.growDown(width, height)
    else return null // need to ensure sensible root starting size to avoid this happening
  }

  growRight(width, height) {
    const oldRoot = this.root
    this.root = {
      used: true,
      xcc: 0,
      ycc: 0,
      width: oldRoot.width + width,
      height: oldRoot.height,
      down: oldRoot,
      right: { xcc: oldRoot.width, ycc: 0, width: width, height: oldRoot.height }
    }
    const node = this.findNode(this.root, width, height)
    return node ? this.splitNode(node, width, height) : null
  }

  growDown(width, height) {
    const oldRoot = this.root
    this.root = {
      used: true,
      xcc: 0,
      ycc: 0,
      width: oldRoot.width,
      height: oldRoot.height + height,
      down: { xcc: 0, ycc: oldRoot.height, width: oldRoot.width, height: height },
      right: oldRoot
    }
    const node = this.findNode(this.root, width, height)
    return node ? this.splitNode(node, width, height) : null
  }
}

class AbstractLayoutStrategy {
  constructor(tilesProgram, wallViewPortWidth = 1400, wallViewPortHeight = 1400) {
    this._tilesProgram = tilesProgram
    this._wallViewPortWidth = wallViewPortWidth
    this._wallViewPortHeight = wallViewPortHeight
  }

  _getZoomLevel() {
    const zoomLevel = this._tilesProgram.get("zoom")
    return zoomLevel ? parseFloat(zoomLevel) : 1.0
  }

  _getVisibleTiles() {
    return this._getTilesProgram()
      .getTiles()
      .filter(tile => tile.isVisible())
  }

  _getVisibleRootTiles() {
    return this._getTilesProgram()
      .getRootLevelTiles()
      .filter(tile => tile.isVisible())
  }

  _getTilesProgram() {
    return this._tilesProgram
  }

  _getWallViewPortWidth() {
    return this._wallViewPortWidth
  }

  _getWallViewPortHeight() {
    return this._wallViewPortHeight
  }
}

class CustomLayout extends AbstractLayoutStrategy {
  makeTileDimensionMap() {
    const tiles = this._getVisibleTiles()
    const needLocations = []
    const dimensionMap = new Map()
    const zoomLevel = this._getZoomLevel()
    tiles.forEach((tile, index) => {
      if (!tile.getLeft()) return needLocations.push(tile)

      dimensionMap.set(tile, CustomLayout._getTileDimension(tile, zoomLevel, tile.getLeft(), tile.getTop()))
    })

    let _top = 0
    needLocations.forEach((tile, index) => {
      const dimension = CustomLayout._getTileDimension(tile, zoomLevel, 0, _top)
      dimensionMap.set(tile, dimension)
      _top += dimension.height / 20
    })

    return dimensionMap
  }
  static _getTileDimension(tile, zoomLevel, left, _top) {
    const gridSize = 20
    const width = Math.floor(zoomLevel * tile.getWidth())
    const height = Math.floor(zoomLevel * tile.getHeight())
    const dimension = {}
    if (left) dimension.left = parseInt(left) * gridSize
    if (_top) dimension.top = parseInt(_top) * gridSize
    if (width) dimension.width = parseInt(width) * gridSize
    if (height) dimension.height = parseInt(height) * gridSize
    return new TileDimension(tile, dimension)
  }
}

const treeLayoutAddTileDimensionToMap = (tile, dimensionMap, left, _top, padding) => {
  // Todo: handle invisibles.
  const suggestedSize = tile.getDefinedOrSuggestedSize()
  const requiredSpace = tile.getRequiredDimensionsForTreeLayout(padding)

  const dimension = new TileDimension(tile, {
    width: suggestedSize.width,
    height: suggestedSize.height,
    left: left + Math.floor(requiredSpace.width - suggestedSize.width) / 2,
    top: _top
  })
  dimensionMap.set(tile, dimension)

  const newTop = _top + suggestedSize.height + padding

  let newLeft = left
  let maxBottom = newTop
  // todo: handle invisibles?
  tile.getChildTiles().forEach(childTile => {
    const result = treeLayoutAddTileDimensionToMap(childTile, dimensionMap, newLeft, newTop, padding)
    newLeft = result.left
    if (result._top > maxBottom) maxBottom = result._top
  })

  return { left: left + requiredSpace.width, _top: maxBottom, dimension: dimension }
}

class TreeLayout extends AbstractLayoutStrategy {
  makeTileDimensionMap() {
    const padding = 10
    const dimensionMap = new Map()

    // Todo: handle invisibles.
    const tiles = this._getTilesProgram().getRootLevelTiles()

    let left = 0
    let _top = 0
    tiles.forEach(tile => {
      const result = treeLayoutAddTileDimensionToMap(tile, dimensionMap, left, _top, padding)
      //left = result.left
      _top = result._top
    })

    return dimensionMap
  }
}

class ColumnLayout extends AbstractLayoutStrategy {
  makeTileDimensionMap() {
    let _top = 0
    const width = 800
    const padding = 10
    const zoomLevel = this._getZoomLevel()
    const boxWidth = Math.max(800, this._getWallViewPortWidth())
    const left = Math.floor((boxWidth - 800) / 2)

    const dimensionMap = new Map()
    this._getVisibleTiles().forEach(tile => {
      const size = tile.getDefinedOrSuggestedSize()
      const height = Math.floor(size.height * zoomLevel)
      const dimension = new TileDimension(tile, {
        width,
        height,
        left,
        top: _top
      })
      dimensionMap.set(tile, dimension)
      _top += height + padding
    })

    return dimensionMap
  }
}

class TiledLayout extends AbstractLayoutStrategy {
  makeTileDimensionMap() {
    let _top = 10
    let left = 10
    const increment = 30
    const zoomLevel = this._getZoomLevel()

    const dimensionMap = new Map()
    this._getVisibleTiles().forEach(tile => {
      const size = tile.getDefinedOrSuggestedSize()
      const dimension = new TileDimension(tile, {
        width: Math.floor(size.width * zoomLevel),
        height: Math.floor(size.height * zoomLevel),
        left: left,
        top: _top
      })
      dimensionMap.set(tile, dimension)
      left += increment
      _top += increment
    })

    return dimensionMap
  }
}

class BinLayout extends AbstractLayoutStrategy {
  makeTileDimensionMap() {
    const dimensionMap = new Map()
    const zoomLevel = this._getZoomLevel()
    const unsortedTiles = this._getVisibleTiles().map(tile => {
      const size = tile.getDefinedOrSuggestedSize()
      return {
        width: Math.floor(size.width * zoomLevel),
        height: Math.floor(size.height * zoomLevel),
        tile: tile
      }
    })

    const sortedTiles = lodash.sortBy(unsortedTiles, tile => Math.max(tile.width, tile.height)).reverse()
    new BinPacker().fit(sortedTiles)
    sortedTiles.forEach(tile => {
      const dimension = new TileDimension(tile.tile, {
        width: tile.width,
        height: tile.height,
        left: tile.fit.xcc,
        top: tile.fit.ycc
      })
      dimensionMap.set(tile.tile, dimension)
    })

    return dimensionMap
  }
}

class Layout {
  constructor() {}

  getTileDimensionMap(sourceTree, strategyName, wallViewPortWidth, wallViewPortHeight) {
    const LayoutStrategies = {
      custom: CustomLayout,
      column: ColumnLayout,
      tree: TreeLayout,
      tiled: TiledLayout,
      bin: BinLayout
    }
    const strategyClass = LayoutStrategies[strategyName] || TreeLayout
    const dimensionMap = new strategyClass(sourceTree, wallViewPortWidth, wallViewPortHeight)
    const map = dimensionMap.makeTileDimensionMap()
    map.forEach((value, key, map) => {
      if (key._isMaximized()) {
        // todo: should be wall viewport width/height?
        value.width = wallViewPortWidth
        value.height = wallViewPortHeight
        value.left = 0
        value.top = 0
      }
    })
    return map
  }
}

module.exports = Layout
