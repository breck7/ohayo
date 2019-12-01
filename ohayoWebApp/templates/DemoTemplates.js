const DemoTemplates = `faq.maia
 web.get maia/packages/samples/faq.md
  parser text
  hidden
  markdown.toHtml
ohayo.maia
 web.get maia/packages/samples/welcome.md?22
  parser text
  hidden
  markdown.toHtml
 templates.list
 challenge.list
 layout column`

module.exports = DemoTemplates
