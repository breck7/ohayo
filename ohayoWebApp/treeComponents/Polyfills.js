// rename lodash
if (!window.lodash) window.lodash = _

// Shim window.console for IE.
if (!window.console) window.console = { log: () => {}, time: () => {}, error: () => {}, debug: () => {} }

// Safari polyfill:
if (!Object.values) Object.values = obj => Object.keys(obj).map(key => obj[key])

const d3format = {}
d3format.format = d3.format
