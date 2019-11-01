const DemoTemplates = `faq.flow
 web.get flow/packages/samples/faq.md
  parser text
  hidden
  markdown.toHtml
ohayo.flow
 web.get flow/packages/samples/welcome.md?22
  parser text
  hidden
  markdown.toHtml
 challenge.list
 templates.list
 layout column`

module.exports = DemoTemplates
