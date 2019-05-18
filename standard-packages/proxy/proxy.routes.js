const superagent = require("superagent")

const ProxyConstants = {}
ProxyConstants.getRoute = "/proxy"
ProxyConstants.queryParams = {}
ProxyConstants.queryParams.url = "url"
ProxyConstants.queryParams.cacheOnServer = "cacheOnServer"

const UrlCache = {}

class HTTPResponse {
  constructor(res) {
    this._res = res
    this._inMemoryCacheTime = Date.now()
  }

  sendTo(res, fromCache) {
    if (!this._asObject) {
      this._asObject = {
        cacheTime: this._inMemoryCacheTime,
        cacheType: "inServerMemory",
        text: this._res.body ? JSON.stringify(this._res.body, null, 2) : this._res.text
      }
    }
    this._asObject.fromCache = fromCache
    res.send(this._asObject)
    return this
  }
}

module.exports = app => {
  app.get(ProxyConstants.getRoute, async (req, res) => {
    const url = req.query[ProxyConstants.queryParams.url]
    const fromCache = req.query[ProxyConstants.queryParams.cacheOnServer] === "true"
    if (!url) return res.status(400).send("No url provided")

    let cacheHit = UrlCache[url]
    // todo: drop the body/text thing.
    if (fromCache && cacheHit) return cacheHit.sendTo(res, true)

    try {
      console.log(`Fetching ${url}`)
      const result = await superagent.get(url)
      // .query(data)
      //.set(this._headers || {})
      // We always return a string, https://visionmedia.github.io/superagent/#response-properties
      if (fromCache) UrlCache[url] = new HTTPResponse(result).sendTo(res, false)
      else res.send({ text: result })
    } catch (err) {
      console.log(err)
      res.status(400).send(err)
    }
  })
}
