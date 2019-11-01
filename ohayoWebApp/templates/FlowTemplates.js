const FlowTemplates = {}

FlowTemplates._fromDelimited = (filename, data, app) => {
  const key = app.initLocalDataStorage(filename, data)
  return `data.localStorage ${key}
 tables.basic`
}

FlowTemplates.tsv = FlowTemplates._fromDelimited

FlowTemplates.json = (filename, data, app) => {
  const key = app.initLocalDataStorage(filename, data)
  return `data.localStorage ${key}`
}

FlowTemplates.csv = (filename, data, app) => {
  // todo: remove \r?
  // check csv subtypes
  const isMultiCsv = data.split("\n\n").length > 3
  if (isMultiCsv) return FlowTemplates._multiCsv(filename, data, app)
  return FlowTemplates._fromDelimited(filename, data, app)
}

FlowTemplates._multiCsv = (filename, data, app) => {
  return data
    .split("\n\n")
    .map(t => t.trim())
    .filter(t => t)
    .map(table => {
      const rows = table.split("\n")
      const tableName = rows.shift()
      const key = app.initLocalDataStorage(filename + "-" + tableName, rows.join("\n"))
      return `data.localStorage ${key}
 tables.basic ${tableName}`
    })
    .join("\n")
}

module.exports = FlowTemplates
