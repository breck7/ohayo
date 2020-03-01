const SpeedTestTemplate = (title, rows) =>
  `data.inline
 content
  ${rows.replace(/\n/g, "\n  ")}
 html.h1 ${title}
 rows.sortBy timeToLoad
  rows.reverse
   doc.subtitle Slow Load Times
   tables.basic
 rows.sortBy timeToRender
  rows.reverse
   doc.subtitle Slow Render Times
   tables.basic
 show.mean timeToLoad
 show.mean timeToRender
 show.median timeToRender
 show.sum timeToLoad
 show.sum timeToRender
 show.rowCount`

module.exports = SpeedTestTemplate
