const CodeMirrorCss = `.CodeMirror {
  font-family: monospace;
  height: 300px;
  color: #000
}

.CodeMirror-lines {
  padding: 4px 0
}

.CodeMirror pre {
  padding: 0 4px
}

.CodeMirror-scrollbar-filler,
.CodeMirror-gutter-filler {
  background-color: #fff
}

.CodeMirror-gutters {
  border-right: 0;
  background-color: #f7f7f7;
  white-space: nowrap
}

.CodeMirror-linenumber {
  padding: 0 3px 0 5px;
  min-width: 20px;
  text-align: right;
  color: #999;
  white-space: nowrap
}

.CodeMirror-guttermarker {
  color: #000
}

.CodeMirror-guttermarker-subtle {
  color: #999
}

.CodeMirror-cursor {
  border-left: 1px solid #000;
  border-right: none;
  width: 0
}

.CodeMirror div.CodeMirror-secondarycursor {
  border-left: 1px solid silver
}

.cm-fat-cursor .CodeMirror-cursor {
  width: auto;
  border: 0!important;
  background: #7e7
}

.cm-fat-cursor div.CodeMirror-cursors {
  z-index: 1
}

.cm-animate-fat-cursor {
  width: auto;
  border: 0;
  -webkit-animation: blink 1.06s steps(1) infinite;
  -moz-animation: blink 1.06s steps(1) infinite;
  animation: blink 1.06s steps(1) infinite;
  background-color: #7e7
}

@-moz-keyframes blink {
  50% {
    background-color: transparent
  }
}

@-webkit-keyframes blink {
  50% {
    background-color: transparent
  }
}

@keyframes blink {
  50% {
    background-color: transparent
  }
}

.cm-tab {
  display: inline-block;
  text-decoration: inherit
}

.CodeMirror-rulers {
  position: absolute;
  left: 0;
  right: 0;
  top: -50px;
  bottom: -20px;
  overflow: hidden
}

.CodeMirror-ruler {
  border-left: 1px solid #ccc;
  top: 0;
  bottom: 0;
  position: absolute
}

.cm-s-default .cm-header {
  color: blue
}

.cm-s-default .cm-quote {
  color: #090
}

.cm-negative {
  color: #d44
}

.cm-positive {
  color: #292
}

.cm-header,
.cm-strong {
  font-weight: 700
}

.cm-em {
  font-style: italic
}

.cm-link {
  text-decoration: underline
}

.cm-strikethrough {
  text-decoration: line-through
}

.cm-s-default .cm-keyword {
  color: #708
}

.cm-s-default .cm-atom {
  color: #219
}

.cm-s-default .cm-number {
  color: #164
}

.cm-s-default .cm-def {
  color: #00f
}

.cm-s-default .cm-variable-2 {
  color: #05a
}

.cm-s-default .cm-variable-3,
.cm-s-default .cm-type {
  color: #085
}

.cm-s-default .cm-comment {
  color: #a50
}

.cm-s-default .cm-string {
  color: #a11
}

.cm-s-default .cm-string-2 {
  color: #f50
}

.cm-s-default .cm-meta {
  color: #555
}

.cm-s-default .cm-qualifier {
  color: #555
}

.cm-s-default .cm-builtin {
  color: #30a
}

.cm-s-default .cm-bracket {
  color: #997
}

.cm-s-default .cm-tag {
  color: #170
}

.cm-s-default .cm-attribute {
  color: #00c
}

.cm-s-default .cm-hr {
  color: #999
}

.cm-s-default .cm-link {
  color: #00c
}

.cm-s-default .cm-error {
  color: red
}

.cm-invalidchar {
  color: red
}

.CodeMirror-composing {
  border-bottom: 2px solid
}

div.CodeMirror span.CodeMirror-matchingbracket {
  color: #0f0
}

div.CodeMirror span.CodeMirror-nonmatchingbracket {
  color: #f22
}

.CodeMirror-matchingtag {
  background: rgba(255, 150, 0, .3)
}

.CodeMirror-activeline-background {
  background: #e8f2ff
}

.CodeMirror {
  position: relative;
  overflow: hidden;
  background: #fff
}

.CodeMirror-scroll {
  overflow: scroll!important;
  margin-bottom: -30px;
  margin-right: -30px;
  padding-bottom: 30px;
  height: 100%;
  outline: none;
  position: relative
}

.CodeMirror-sizer {
  position: relative;
  border-right: 30px solid transparent
}

.CodeMirror-vscrollbar,
.CodeMirror-hscrollbar,
.CodeMirror-scrollbar-filler,
.CodeMirror-gutter-filler {
  position: absolute;
  z-index: 6;
  display: none
}

.CodeMirror-vscrollbar {
  right: 0;
  top: 0;
  overflow-x: hidden;
  overflow-y: scroll
}

.CodeMirror-hscrollbar {
  bottom: 0;
  left: 0;
  overflow-y: hidden;
  overflow-x: scroll
}

.CodeMirror-scrollbar-filler {
  right: 0;
  bottom: 0
}

.CodeMirror-gutter-filler {
  left: 0;
  bottom: 0
}

.CodeMirror-gutters {
  position: absolute;
  left: 0;
  top: 0;
  min-height: 100%;
  z-index: 3
}

.CodeMirror-gutter {
  white-space: normal;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  margin-bottom: -30px
}

.CodeMirror-gutter-wrapper {
  position: absolute;
  z-index: 4;
  background: none!important;
  border: none!important
}

.CodeMirror-gutter-background {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 4
}

.CodeMirror-gutter-elt {
  position: absolute;
  cursor: default;
  z-index: 4
}

.CodeMirror-gutter-wrapper ::selection {
  background-color: transparent
}

.CodeMirror-gutter-wrapper ::-moz-selection {
  background-color: transparent
}

.CodeMirror-lines {
  cursor: text;
  min-height: 1px
}

.CodeMirror pre {
  -moz-border-radius: 0;
  -webkit-border-radius: 0;
  border-radius: 0;
  border-width: 0;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  margin: 0;
  white-space: pre;
  word-wrap: normal;
  line-height: inherit;
  color: inherit;
  z-index: 2;
  position: relative;
  overflow: visible;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-variant-ligatures: contextual;
  font-variant-ligatures: contextual
}

.CodeMirror-wrap pre {
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: normal
}

.CodeMirror-linebackground {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 0
}

.CodeMirror-linewidget {
  position: relative;
  z-index: 2;
  overflow: auto
}

.CodeMirror-rtl pre {
  direction: rtl
}

.CodeMirror-code {
  outline: none
}

.CodeMirror-scroll,
.CodeMirror-sizer,
.CodeMirror-gutter,
.CodeMirror-gutters,
.CodeMirror-linenumber {
  -moz-box-sizing: content-box;
  box-sizing: content-box
}

.CodeMirror-measure {
  position: absolute;
  width: 100%;
  height: 0;
  overflow: hidden;
  visibility: hidden
}

.CodeMirror-cursor {
  position: absolute;
  pointer-events: none
}

.CodeMirror-measure pre {
  position: static
}

div.CodeMirror-cursors {
  visibility: hidden;
  position: relative;
  z-index: 3
}

div.CodeMirror-dragcursors {
  visibility: visible
}

.CodeMirror-focused div.CodeMirror-cursors {
  visibility: visible
}

.CodeMirror-selected {
  background: #d9d9d9
}

.CodeMirror-focused .CodeMirror-selected {
  background: #d7d4f0
}

.CodeMirror-crosshair {
  cursor: crosshair
}

.CodeMirror-line::selection,
.CodeMirror-line>span::selection,
.CodeMirror-line>span>span::selection {
  background: #d7d4f0
}

.CodeMirror-line::-moz-selection,
.CodeMirror-line>span::-moz-selection,
.CodeMirror-line>span>span::-moz-selection {
  background: #d7d4f0
}

.cm-searching {
  background: #ffa;
  background: rgba(255, 255, 0, .4)
}

.cm-force-border {
  padding-right: .1px
}

@media print {
  .CodeMirror div.CodeMirror-cursors {
    visibility: hidden
  }
}

.cm-tab-wrap-hack:after {
  content: ''
}

span.CodeMirror-selectedtext {
  background: none
}

.CodeMirror-hints {
  position: absolute;
  z-index: 10;
  overflow: hidden;
  list-style: none;
  margin: 0;
  padding: 2px;
  -webkit-box-shadow: 2px 3px 5px rgba(0, 0, 0, .2);
  -moz-box-shadow: 2px 3px 5px rgba(0, 0, 0, .2);
  box-shadow: 2px 3px 5px rgba(0, 0, 0, .2);
  border-radius: 3px;
  border: 1px solid silver;
  background: #fff;
  font-size: 90%;
  font-family: monospace;
  max-height: 20em;
  overflow-y: auto
}

.CodeMirror-hint {
  margin: 0;
  padding: 0 4px;
  border-radius: 2px;
  white-space: pre;
  color: #000;
  cursor: pointer
}

li.CodeMirror-hint-active {
  background: #08f;
  color: #fff
}

.CodeMirror { background: transparent;}

.cm-s-oceanic-next.CodeMirror { background: #304148; color: #f8f8f2; }

.cm-s-oceanic-next div.CodeMirror-selected { background: rgba(101, 115, 126, 0.33); }
.cm-s-oceanic-next .CodeMirror-line::selection, .cm-s-oceanic-next .CodeMirror-line > span::selection, .cm-s-oceanic-next .CodeMirror-line > span > span::selection { background: rgba(101, 115, 126, 0.33); }
.cm-s-oceanic-next .CodeMirror-line::-moz-selection, .cm-s-oceanic-next .CodeMirror-line > span::-moz-selection, .cm-s-oceanic-next .CodeMirror-line > span > span::-moz-selection { background: rgba(101, 115, 126, 0.33); }
.cm-s-oceanic-next .CodeMirror-gutters { background: #304148; border-right: 10px; }
.cm-s-oceanic-next .CodeMirror-guttermarker { color: white; }
.cm-s-oceanic-next .CodeMirror-guttermarker-subtle { color: #d0d0d0; }
.cm-s-oceanic-next .CodeMirror-linenumber { color: #d0d0d0; }
.cm-s-oceanic-next .CodeMirror-cursor { border-left: 1px solid #f8f8f0; }

.cm-s-oceanic-next span.cm-comment { color: #65737E; }
.cm-s-oceanic-next span.cm-atom { color: #C594C5; }
.cm-s-oceanic-next span.cm-number { color: #F99157; }

.cm-s-oceanic-next span.cm-property { color: #99C794; }
.cm-s-oceanic-next span.cm-attribute,
.cm-s-oceanic-next span.cm-keyword { color: #C594C5; }
.cm-s-oceanic-next span.cm-builtin { color: #66d9ef; }
.cm-s-oceanic-next span.cm-string { color: #99C794; }

.cm-s-oceanic-next span.cm-variable,
.cm-s-oceanic-next span.cm-variable-2,
.cm-s-oceanic-next span.cm-variable-3 { color: #f8f8f2; }
.cm-s-oceanic-next span.cm-def { color: #6699CC; }
.cm-s-oceanic-next span.cm-bracket { color: #5FB3B3; }
.cm-s-oceanic-next span.cm-tag { color: #C594C5; }
.cm-s-oceanic-next span.cm-header { color: #C594C5; }
.cm-s-oceanic-next span.cm-link { color: #C594C5; }
.cm-s-oceanic-next span.cm-error { background: #C594C5; color: #f8f8f0; }

.cm-s-oceanic-next .CodeMirror-activeline-background { background: rgba(101, 115, 126, 0.33); }
.cm-s-oceanic-next .CodeMirror-matchingbracket {
  text-decoration: underline;
  color: white !important;
}

.cm-s-oceanic-next.CodeMirror {background: transparent;}
`.replace(/\n/g, "")

module.exports = CodeMirrorCss
