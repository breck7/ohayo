const { jtree } = require("jtree")

const OhayoCodeEditorTemplate = (source, fileName, treeLanguage) =>
  new jtree.TreeNode(`doc.title Source code visualization of {fileName}
data.inline
 parser text
 treeLanguage {treeLanguage}
 text.lineCount
  show.median lines Total lines
 text.wordCount
  show.sum count Total words
 treenotation.3d
 treenotation.outline
 treenotation.wordTypes
  html.printAs pre
   text.wordCount
    tables.basic
    text.wordcloud
 content
  {source}`).templateToString({ source, fileName, treeLanguage })

module.exports = OhayoCodeEditorTemplate
