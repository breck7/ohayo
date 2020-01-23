#!/usr/bin/env ts-node

const recursiveReadSync = require("recursive-readdir-sync")
const spawn = require("child_process").spawn
const fs = require("fs")
const exec = require("child_process").exec // todo: execSync?
const { jtree } = require("jtree")

const rootDir = __dirname + "/"

const { AbstractBuilder } = require("jtree/products/AbstractBuilder.node.js")
const { TypeScriptRewriter } = require("jtree/products/TypeScriptRewriter.js")
const project = require("jtree/products/project.nodejs.js")
const { Disk } = require("jtree/products/Disk.node.js")

class Builder extends AbstractBuilder {
  updateVersion(newVersion: string) {
    const currentVersion = this._getVersion().split(/\./g)

    newVersion = newVersion ? newVersion : [currentVersion[0], currentVersion[1], parseFloat(currentVersion[2]) + 1].join(".")

    Disk.write(
      "ohayoWebApp/treeComponents/Version.js",
      `const Version = "${newVersion}"
if (typeof exports !== "undefined") module.exports = Version
`
    )
    const packagePath = rootDir + "package.json"
    const packageJson = JSON.parse(Disk.read(packagePath))
    packageJson.version = newVersion
    Disk.write(packagePath, JSON.stringify(packageJson, null, 2))

    console.log(`Updated to version ${newVersion}`)

    const parsedVersion = newVersion.split(/\./g)

    const semVersion = [parsedVersion[0], parsedVersion[1], parsedVersion[2]].join(".")

    const now = new Date()
    const day = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()
    const line1 = semVersion + " " + day
    const delimiter = "-".repeat(line1.length)
    const releaseNotesPath = rootDir + "releasenotes.md"
    const currentReleaseNotes = Disk.read(releaseNotesPath)
    const newReleaseNotes = `${line1}
${delimiter}
-

${currentReleaseNotes}`

    Disk.write(releaseNotesPath, newReleaseNotes)
  }

  private _browserfy(file: string) {
    return new TypeScriptRewriter(file)
      .removeRequires()
      .removeUseStrict()
      .removeTsGeneratedCrap()
      .removeNodeJsOnly()
      .changeNodeExportsToWindowExports()
      .getString()
  }

  _readAndCombine(scripts: string[]) {
    return scripts.map(filepath => Disk.read(filepath)).join(";\n\n")
  }

  _getVersion() {
    return require("./package.json").version
  }

  _getTreeScripts() {
    return `maia/packages/challenge/challenges.tree
maia/packages/templates/Templates.stamp
ohayoWebApp/treeComponents/Ohayo.drums`.split("\n")
  }

  _getLibScripts(jtreeProductsPath = `node_modules/jtree/products/`, maiaPath = "") {
    return `node_modules/moment/min/moment.min.js
node_modules/moment-parseformat/dist/moment-parseformat.js
node_modules/marked/marked.min.js
node_modules/numeral/min/numeral.min.js
node_modules/d3-format/dist/d3-format.js
node_modules/lodash/lodash.min.js
node_modules/store/dist/store.modern.min.js
node_modules/tinycolor2/dist/tinycolor-min.js
node_modules/superagent/dist/superagent.js
node_modules/mousetrap/mousetrap.min.js
node_modules/jquery/dist/jquery.min.js
node_modules/jquery-ui-dist/jquery-ui.min.js
node_modules/codemirror/lib/codemirror.js
node_modules/codemirror/addon/hint/show-hint.js
${jtreeProductsPath}jtree.browser.js
${jtreeProductsPath}jtable.browser.js
${jtreeProductsPath}stump.browser.js
${jtreeProductsPath}fire.browser.js
${jtreeProductsPath}hakon.browser.js
${jtreeProductsPath}TreeComponentFramework.browser.js
${maiaPath}maia/maia.browser.js`.split("\n")
  }

  makeScriptTags(scripts: string[]) {
    const now = Date.now()
    return scripts.map(filepath => `  <script src="${filepath}?${now}"></script>`).join("\n")
  }

  _getBrowserScripts(path: string) {
    return recursiveReadSync(path)
      .filter((filename: string) => filename.match(/\.js$/))
      .filter((filename: string) => !filename.includes("node_modules"))
      .filter((filename: string) => !filename.includes("ignore"))
      .filter((filename: string) => !filename.match(/\.test\.js$/))
      .filter((filename: string) => !filename.match(/\.nodejs\.js$/))
      .filter((filename: string) => !filename.match(/\.node\.js$/)) // todo: remove this line
  }

  _makeProjectFileAndGetClientScripts() {
    const scripts = this._getBrowserScripts(__dirname + "/ohayoWebApp/")
    const projectProgram = new project(project.makeProjectProgramFromArrayOfScripts(scripts))
    Disk.write(rootDir + "ohayo.project", projectProgram.toString())
    return projectProgram.getScriptPathsInCorrectDependencyOrder()
  }

  startDevServer(programFolder = rootDir) {
    new (require("./OhayoServerApp.js")).DevServer(2222, programFolder).listenForFileChanges().start()
  }

  profile() {
    exec(`node --prof ${rootDir}builder.js test`)
    // node --prof builder.js test
    // node --prof-process isolate-0x103000000-v8.log > processed-v8.log
    // node --prof-process isolate-0x102801600-v8.log > processed-v8.log
  }

  produceOSwarmGrammar() {
    return this._buildGrammar(
      [__dirname + "/node_modules/jtree/langs/swarm/swarm.grammar", __dirname + "/testing/oswarm.gram"],
      __dirname + "/testing/oswarm.grammar",
      __dirname + "/testing/"
    )
  }

  produceGopherGrammar() {
    return jtree.compileGrammarForNodeJs(__dirname + "/testing/gopher.grammar", __dirname + "/testing/", true)
  }

  produceTemplatesFile() {
    // # todo: pipe without echoing a newline?
    exec(`jtree stamp ${rootDir}maia/packages/templates/templates content > maia/packages/templates/Templates.stamp`)
  }

  _makeOhayoHtmlPage(header: string, footer: string, faviconPath: string) {
    const OhayoConstants = require("./ohayoWebApp/treeComponents/OhayoConstants.js")
    const slogan = `${OhayoConstants.productName} - ${OhayoConstants.slogan}`
    const keywords = "dashboards, data science, r, python, jupyter, anaconda"
    return `<!doctype html>
<html>
<head>
  <title>${slogan}</title>
  <meta name="description" content="${slogan}">
  <meta name="keywords" content="${keywords}">
  <link rel="shortcut icon" type="image/x-icon" href="images/${faviconPath}">
  <script>const DefaultServerCurrentWorkingDirectory = "/";</script>
${header}
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="${OhayoConstants.productName}">
  <meta name="mobile-web-app-capable" content="yes">
  ${footer}
  <script>window.app = new OhayoWebApp(OhayoWebApp.getDefaultStartState())
  window.app.startWhenReady()</script>
</head>
<body>
</body>
</html>
`
  }

  formatGrams() {
    this._getAllSourceFiles()
      .filter(file => file.endsWith(".gram") || file.endsWith(".grammar"))
      .forEach(file => {
        jtree.formatFileInPlace(file, __dirname + "/node_modules/jtree/langs/grammar/grammar.grammar")
      })
  }

  startServer() {
    this._startServer(8888, __dirname + "/")
  }

  buildDist(distFolder = `${__dirname}/dist`) {
    exec(
      `echo "Remove dist folder first";
mkdir ${distFolder};
cp ${__dirname}/index.html ${distFolder}/;
cp ${__dirname}/ohayo.es6.browser.js ${distFolder}/;
cp -r ${__dirname}/maia ${distFolder}/;
cp -r ${__dirname}/images ${distFolder}/;`
    )
  }

  buildBuilder() {
    this._buildTsc(Disk.read(__filename), __dirname + "/builder.js")
  }

  _makeTestTreeForFolder(allTestFiles: string[]) {
    const fileTestTree: any = {}
    const oswarmNode = require("./testing/oswarm.nodejs.js")
    const gopherNode = require("./testing/gopher.nodejs.js")
    const swarmNode = require("jtree/products/swarm.nodejs.js")
    const grammarNode = require("jtree/products/grammar.nodejs.js")

    allTestFiles
      .filter(file => file.endsWith(".grammar"))
      .forEach(file => {
        fileTestTree[file] = (equal: Function) => {
          // Act
          const program = new grammarNode(Disk.read(file))
          const errs = program.getAllErrors()
          if (errs.length) console.log(errs.join("\n"))
          //Assert
          equal(errs.length, 0, "should be no errors in grammar")
        }
      })

    allTestFiles
      .filter(file => file.endsWith(".test.js") || file.endsWith(".test.ts"))
      .forEach(file => {
        fileTestTree[file] = require(file).testTree
      })

    allTestFiles
      .filter(file => file.endsWith(".swarm"))
      .forEach(file => {
        Object.assign(fileTestTree, new swarmNode(Disk.read(file)).compileToRacer(file))
      })

    allTestFiles
      .filter(file => file.endsWith(".oswarm"))
      .forEach(file => {
        Object.assign(fileTestTree, new oswarmNode(Disk.read(file)).compileToRacer(file))
      })

    allTestFiles
      .filter(file => file.endsWith(".gopher"))
      .forEach(file => {
        const oswarmCode = new gopherNode(Disk.read(file)).compileToOSwarm()
        Object.assign(fileTestTree, new oswarmNode(oswarmCode).compileToRacer(file))
      })

    return fileTestTree
  }

  _getAllSourceFiles(): string[] {
    const getFiles = (dir: string) => recursiveReadSync(dir).filter((file: string) => !file.includes("node_modules") && !file.includes("ignore/"))
    return jtree.Utils.flatten([__dirname + "/maia/", __dirname + "/ohayoWebApp/"].map(getFiles))
  }

  trainMaiaModel() {
    const maiaNode = require(__dirname + "/maia/maia.nodejs.js")
    const testBlankProgram = new maiaNode()
    const handGrammarProgram = testBlankProgram.getHandGrammarProgram()
    const examples: string[] = handGrammarProgram.getNodesByGlobPath("* example").map((node: any) => node.childrenToString())
    const templates = new jtree.TreeNode(Disk.read(__dirname + "/maia/packages/templates/Templates.stamp"))
      .getNodesByGlobPath("file data")
      .map((node: any) => node.childrenToString())
    const model = handGrammarProgram.trainModel(examples.concat(templates), maiaNode)
    Disk.writeJson(__dirname + "/maia/maia.model.js", model)
  }

  private _getMaiaExamplesTestTree() {
    const maiaPath = `${__dirname}/maia/maia.nodejs.js`
    const maiaNode = require(maiaPath)
    const handGrammarProgram = new maiaNode().getHandGrammarProgram()
    return handGrammarProgram.examplesToTestBlocks(maiaNode)
  }

  async test() {
    const fileTree = this._makeTestTreeForFolder(this._getAllSourceFiles())
    fileTree.maiaExamples = this._getMaiaExamplesTestTree()

    const runner = new jtree.TestRacer(fileTree)
    await runner.execute()
    runner.finish()
  }

  produceProdJs() {
    const common = this._makeProjectFileAndGetClientScripts()
      .map((filepath: string) => Disk.read(filepath))
      .map((file: string) => this._browserfy(file))
      .join(";\n\n")
    const trees = this._getTreeScripts()
      .map(file => TypeScriptRewriter.treeToJs(file, Disk.read(file)))
      .join("\n")
    // const jtreeProductsPath = __dirname + "/../jtree/products/"
    const jtreeProductsPath = __dirname + "/node_modules/jtree/products/"
    const libs = this._readAndCombine(this._getLibScripts(jtreeProductsPath, `${__dirname}/`))
    Disk.write(
      `${rootDir}${this._getCombinedPath()}`,
      `"use strict";
${libs}
${trees}
${common}`
    )
  }

  updateGrammars() {
    const { GrammarUpgrader } = require("jtree/langs/grammar/GrammarUpgrader.ts")

    new GrammarUpgrader()
      .upgradeManyInPlace(
        [
          __dirname + "/ohayoWebApp/**/*.grammar",
          __dirname + "/ohayoWebApp/**/*.gram",
          __dirname + "/maia/**/*.grammar",
          __dirname + "/maia/**/*.gram",
          __dirname + "/testing/*.grammar"
        ],
        "5.0.0",
        "6.0.0"
      )
      .forEach((item: any) => console.log(item.path, item.tree.toString()))
  }

  _getCombinedPath() {
    return "ohayo.es6.browser.js"
  }

  _getOhayoFolder() {
    return rootDir
  }

  produceProdHtml() {
    Disk.write(`${this._getOhayoFolder()}index.html`, this._makeOhayoHtmlPage(``, `<script src="${this._getCombinedPath()}?v=${this._getVersion()}"></script>`, "favicon.ico"))
  }

  produceDevServerHtml() {
    const htmlPath = `${rootDir}dev.html`

    const libs = this.makeScriptTags(this._getLibScripts())
    const treeScripts = this.makeScriptTags(this._getTreeScripts())
    const common = this.makeScriptTags(this._makeProjectFileAndGetClientScripts()).replace(new RegExp(__dirname + "/", "g"), "")

    const header = [libs, treeScripts, common].join("\n")

    const html = this._makeOhayoHtmlPage(header, "", "favicon-dev.ico")
    Disk.write(htmlPath, html)
  }

  _buildGrammar(files: string[], combinedGrammarFilePath: string, compiledOutputFolder = `${rootDir}ignore/`) {
    const combined = jtree.combineFiles(files)

    combined.delete("tooling")
    combined.toDisk(combinedGrammarFilePath)
    // todo: for now we need to sort grammar files otherwise things will be used before defined.
    jtree.formatFileInPlace(combinedGrammarFilePath, __dirname + "/node_modules/jtree/langs/grammar/grammar.grammar")

    console.log(jtree.compileGrammarForBrowser(combinedGrammarFilePath, compiledOutputFolder, true))
    console.log(jtree.compileGrammarForNodeJs(combinedGrammarFilePath, compiledOutputFolder, true))
  }

  produceTilesGrammar() {
    return this._buildGrammar(["ohayoWebApp/tiles/grams/*.gram"], "ohayoWebApp/tiles/tiles.grammar", "ohayoWebApp/tiles/")
  }

  produceMaiaGrammar() {
    this.produceTilesGrammar()
    return this._buildGrammar(["ohayoWebApp/tiles/tiles.grammar", "maia/grams/*.gram", "maia/packages/*/*.gram"], "maia/maia.grammar", __dirname + "/maia/")
  }

  produceSVGFile() {
    const cleanFile = (str: string) => {
      const index = str.indexOf("<svg")
      return str.substr(index)
    }

    const path = `${rootDir}/ohayoWebApp/themes/svg/`
    const files = fs
      .readdirSync(path)
      .filter((filename: string) => filename.includes(".svg"))
      .map((filename: string) => {
        const chars = cleanFile(fs.readFileSync(path + filename, "utf8"))
        return {
          chars: chars,
          name: filename.substr(4).replace(".svg", "")
        }
      })

    const template = (file: any) => `SVGS["${file.name}"] = \`${file.chars.replace(/(\n|\r)/g, "")}\``

    const newFile = `const SVGS = {}

${files.map(template).join("\n")}

module.exports = SVGS
`

    fs.writeFileSync("ohayoWebApp/themes/SVGS.js", newFile, "utf8")
  }

  produceAll() {
    const methods = `produceDevServerHtml
produceMaiaGrammar
produceGopherGrammar
produceProdHtml
produceProdJs
produceSVGFile
produceTemplatesFile
produceTilesGrammar
produceOSwarmGrammar`.split("\n")
    const results: string[] = []
    methods.forEach(name => {
      try {
        this[name]()
        results.push(`SUCCESS: ${name}`)
      } catch (err) {
        results.push(`FAILURE: ${name}`)
      }
    })
    console.log(results.join("\n"))
  }
}

export { Builder }

if (!module.parent) new Builder().main(process.argv[2], process.argv[3], process.argv[4])
