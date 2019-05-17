#! /usr/local/bin/node

const express = require("express")
const bodyParser = require("body-parser")
const glob = require("glob")

const OhayoServerAppConstants = {}
OhayoServerAppConstants.routeFileGlob = "/*/*.routes.js"
OhayoServerAppConstants.standardPackagesFolder = "/standard-packages/"
OhayoServerAppConstants.appName = "ohayo"

class OhayoServerApp {
  constructor(port = 1111, cwd = process.cwd(), hostname = "localhost", protocol = "http") {
    this._cwd = cwd
    this._port = port
    this._hostname = hostname
    this._protocol = protocol
    this._verboseOn = true
  }

  getCwd() {
    return this._cwd
  }

  get app() {
    if (!this._app) this._initApp()
    return this._app
  }

  _getPackageDirectories() {
    return [__dirname + OhayoServerAppConstants.standardPackagesFolder]
  }

  _getStaticRoutes() {
    return [__dirname + "/", this.getCwd()]
  }

  _initApp() {
    const app = express()
    this._app = app
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.cwd = this.getCwd()

    this._getStaticRoutes().forEach(path => this._initStaticRoute(path))

    // Load: standard. node_modules. custom-packages.
    this._getPackageDirectories().forEach(dir => this._initPackageFolder(dir))

    return app
  }

  _initStaticRoute(path) {
    this.app.use(
      "/",
      express.static(path, {
        maxAge: 31557600000
      })
    )
  }

  _verbose(msg) {
    if (this._verboseOn) console.log(msg)
  }

  _initPackageFolder(folder) {
    this._verbose(`Loading folder ${folder}...`)
    glob
      .sync(folder + OhayoServerAppConstants.routeFileGlob) // todo: don't recurse.
      .flat()
      .forEach(filePath => {
        this._verbose(`Loading package ${filePath}...`)
        require(filePath)(this.app)
      })
  }

  _getAppName() {
    return OhayoServerAppConstants.appName
  }

  _getHomePage() {
    return `${this._protocol}://${this._hostname}:${this._port}/`
  }

  start() {
    this.app.listen(this._port, () => {
      console.log(`Running ${this._getAppName()} in folder '${this.getCwd()}'. cmd+dblclick: ${this._getHomePage()}`)
    })
  }
}

module.exports = OhayoServerApp

if (!module.parent) new OhayoServerApp(process.argv[2]).start()
