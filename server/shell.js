const exec = require("child_process").exec

const commandMap = {
  ls: "ls",
  gitls: "git ls-files",
  gitlog: `echo "hash\tauthor\ttime\tmessage"; git log --date=local --pretty=format:"%h%x09%an%x09%ad%x09%s"`
}

module.exports = app => {
  app.get("/shell", (req, res) => {
    const command = req.query.command
    if (!command) return res.send("no command")
    const actualCommand = commandMap[command]
    if (!actualCommand) return res.send("unsupported command")
    const cwd = req.query.cwd || __dirname

    exec(actualCommand, { cwd: cwd }, (err, out, stderr) => {
      if (err) return res.send(err)
      res.send(out)
    })
  })
}
