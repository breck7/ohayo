const StorageKeys = {}
StorageKeys.autoSave = "__autoSave"
StorageKeys.appState = "__appState"
StorageKeys.visitCount = "__visitCount"
StorageKeys.workingFolderFullDiskFolderPath = "__workingFolderFullDiskFolderPath"

StorageKeys.isKey = key => {
  if (!StorageKeys._storageKeysmap) {
    StorageKeys._storageKeysmap = {}
    Object.values(StorageKeys).forEach(value => (StorageKeys._storageKeysmap[value] = true))
  }
  return StorageKeys._storageKeysmap[key]
}

module.exports = StorageKeys
