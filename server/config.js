const fs = require("fs")
const os = require("os")

const defaultConfig = {
  storageFolder: os.homedir() + "/ohayo-programs/"
}
const configFilePath = os.homedir() + "/ohayo-config.json"
if (!fs.existsSync(configFilePath)) fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2), "utf8")

module.exports = JSON.parse(fs.readFileSync(configFilePath, "utf8"))

