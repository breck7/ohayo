const DemoTemplates = `faq.ohayo
 web.get ohayo/packages/samples/faq.md
  parser text
  hidden
  markdown.toHtml
ohayo.ohayo
 web.get ohayo/packages/samples/welcome.md
  parser text
  hidden
  markdown.toHtml
 templates.list
 challenge.list
 doc.layout column`

module.exports = DemoTemplates
