const SpeedTestTemplate = (title, rows) =>
  `data.inline
 content
  ${rows.replace(/\n/g, "\n  ")}
 html.h1 ${title}
 rows.sortBy timeToLoad
  rows.reverse
   tables.basic Slow Load Times
 rows.sortBy timeToRender
  rows.reverse
   tables.basic Slow Render Times
 show.mean timeToLoad
 show.mean timeToRender
 show.median timeToRender
 show.sum timeToLoad
 show.sum timeToRender
 show.rowCount`

module.exports = SpeedTestTemplate
