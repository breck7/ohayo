const superagent = require("superagent")

module.exports = app => {
  app.get("/proxy", async (req, res) => {
    const url = req.query.url
    if (!url) return res.send("")

    try {
      const result = await superagent.get("https://" + url)
      // .query(data)
      //.set(this._headers || {})
      res.send(result.body || result.text)
    } catch (err) {
      console.log(err)
      res.status(400).send(err)
    }
  })
}
