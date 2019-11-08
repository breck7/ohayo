const { jtree } = require("jtree")

const AbstractModalTreeComponent = require("./AbstractModalTreeComponent.js")
const OhayoConstants = require("./OhayoConstants.js")

class HelpModal extends AbstractModalTreeComponent {
  getMomentHelp() {
    return `Char;Example;Description
YYYY;2014;4 or 2 digit year
YY;14;2 digit year
Y;-25;Year with any number of digits and sign
Q;1..4;Quarter of year. Sets month to first month in quarter.
M MM;1..12;Month number
MMM MMMM;Jan..December;Month name in locale set by moment.locale()
D DD;1..31;Day of month
Do;1st..31st;Day of month with ordinal
DDD DDDD;1..365;Day of year
X;1410715640.579;Unix timestamp
x;1410715640579;Unix ms timestamp
H HH;0..23;24 hour time
h hh;1..12;12 hour time used with a A.
a/p A/P;am pm;Post or ante meridiem
m mm;0..59;Minutes
s ss;0..59;Seconds
S SS SSS;0..999;Fractional seconds
Z ZZ;+12:00;Offset from UTC as +-HH:mm, +-HHmm, or Z
w ww;1..53;Locale week of year
e;0..6;Locale day of week
ddd dddd;Mon...Sunday;Day name in locale set by moment.locale()
E;1..7;ISO day of week`
      .split("\n")
      .map(line => {
        const parts = line.split(";")
        return `<tr><td>${parts[0]}</td><td>${parts[1]}</td><td>${parts[2]}</td></tr>`
      })
      .join("")
  }

  toHakonCode() {
    return `${super.toHakonCode()}
p
 width 100%
 white-space normal
.helpToggle
 display block
.helpSection
.helpCategory
 font-weight bold
#shortcutsHelp td
 padding-right 10px`
  }

  _getShortcutsHelpStumpCode() {
    let lastCat = ""
    const app = this.getRootNode()
    const shortcutRows = app
      .getKeyboardShortcuts()
      .map(shortcut => {
        const category = shortcut.getCategory()
        let cat = ""
        if (category !== lastCat) {
          cat = ` tr
  td <br>${category}
   class helpCategory
  td
`
          lastCat = category
        }
        const description = shortcut.getDescription()
        return `${cat} tr
  style ${description ? "" : "display: none;"}
  td ${shortcut.getKeyCombo() || "-"}
  td &nbsp;&nbsp;
   ${shortcut.isEnabled(app) ? "a" : "span"} ${description}
    stumpOnClickCommand ${shortcut.getFn()}`
      })
      .join("\n")
    return `table
 id shortcutsHelp
 class helpSection
${shortcutRows}`
  }

  getModalStumpCode() {
    const app = this.getRootNode()
    return `h4 About ${OhayoConstants.productName}
p ${OhayoConstants.productName} is ${OhayoConstants.slogan}.
p
 span ${OhayoConstants.productName} is on
 a GitHub
  href ${OhayoConstants.githubLink}
 span and
 a Reddit
  href ${OhayoConstants.subredditLink}
p Current working folder: ${app.getDefaultDisk().getPathBase()}
p Version ${app.getVersion()} ${app.constructor.name}
p
 a Welcome Page
  id welcomePageButton
  stumpOnClickCommand openOhayoProgramCommand
  value ohayo.maia
a Keyboard Shortcuts
 class helpToggle
 stumpOnClickCommand toggleShadowByIdCommand
 value shortcutsHelp
${this._getShortcutsHelpStumpCode()}`
  }
}

module.exports = HelpModal
