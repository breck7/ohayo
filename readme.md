# Ohayo

[![Build Status](https://travis-ci.org/treenotation/ohayo.svg?branch=master)](https://travis-ci.org/treenotation/ohayo)

Ohayo is a fast and free tool for data science. Ohayo consists of a very high level programming language and a visual web studio for that language.

You can try ohayo at [https://ohayo.computer](https://ohayo.computer), [download Ohayo on GitHub](https://github.com/treenotation/ohayo), try Ohayo [hosted on GitHub](https://treenotation.github.io/ohayo/), or install it using `npm install ohayo`.

![Slides](slides.gif)

## Mission

Let's make it faster to do data science. Much faster. So fast that you can do data science as fast as you can speak.

## Key Concepts

**OhayoLang** [Ohayo the language](https://github.com/treenotation/ohayo/tree/master/ohayo) is a Tree Language, built using [Tree Notation](https://treenotation.org/). Ohayo is a dataflow language.

**Scripts** OhayoLang is a scripting language like any other and you can write programs in it by hand or using the Ohayo Studio. OhayoLang scripts generally have the file extension ".ohayo".

**Tiles** An Ohayo program is composed of Tiles. Tiles can display UI to the user. Tiles are recursive and can be the parent of other tiles. Tiles are namespaced and all must contain at least one ".".

**Tile Properties** Tiles can define and use their own Properties. The names of Tile Properties cannot contain a ".".

**DataTables** All Tiles can access the tables of their ancestor tiles and also pass on a new table to their descendants. The data tables currently use the [jTable library](https://github.com/treenotation/jtree/tree/master/jtable).

**Common Tile Types** All Tiles extend from a base class. The three most common core Tile Types are Provider, Transformer, and Chart. In data science you have 3 main kinds of things: datasets, data transformations, and visualizations. Datasets include everything from weather forecasts to emails to business transactions. There are millions of possible datasets. In Ohayo tiles that provide datasets generally extend the Provider base tile type. Transformations are things like filtering, grouping, and joining. In Ohayo tiles that transform data generally extend the Transformer tile type. Charts include bar charts, line charts, scatterplots and word clouds. In Ohayo charts generally extend the Chart base tile type.

**Creating Tiles** If you need a new tile—to add a new user friendly data source or visualization type, for example—you can implement it using TypeScript/Javascript/Grammar language. See the [packages folder](https://github.com/treenotation/ohayo/tree/master/ohayo/packages) for examples. Documentation for this will come out later in 2020.

## BETA!

Ohayo is still beta and iterating frequently. Post feedback here or on the [Ohayo subreddit](https://www.reddit.com/r/ohayocomputer). Ohayo hopefully will be stable by July 2020.

## Marketing Jumbo

If you are looking for some marketing-speak, here you go:

1. The simplest syntax possible. No parentheses, no brackets, no semicolons. Just words you can speak.
2. Write by hand or program visually. The first visual editor that generates perfectly clean code.
3. Autocomplete like you've never seen before. AI powered autocomplete that keeps getting better.
4. Free and open source. The price is $0, and extensions and collaboration are welcome.
5. No installing required. Run Ohayo instantly in your browser, even on your mobile device.
6. No tracking, no cookies. Ohayo doesn't track users, use cookies, or store your data.
7. Secure by design. Your data stays on your machines, we never see it.
8. Runs anywhere. Run it from our sites, host it yourself, or run it on your local machine.

## Other Tools For Data Scientists

Ohayo is just one of my tools that are trying to make data science easier. Here's a list of related products:

|Name|Website|Year|WikipediaPage|
|-|-|-|-|
|Grid Studio|https://github.com/ricklamers/gridstudio|2019||
workbenchdata
|Workbench|https://workbenchdata.com/|2018||
|Observable|https://observablehq.com/|2017||
|Idyll|https://idyll-lang.org/|2017||
|Google Data Studio|https://datastudio.google.com/overview|2016|https://de.wikipedia.org/wiki/Google_Data_Studio|
|Tidyverse|https://www.tidyverse.org/|2016|https://en.wikipedia.org/wiki/Tidyverse|
|Vega Editor|https://vega.github.io/editor/|2015||
|Amazon QuickSight|https://aws.amazon.com/quicksight/|2015||
|GapMinder Vizabi|https://vizabi.org/|2015||
|xsv|https://github.com/BurntSushi/xsv|2014||
|dplyr|https://dplyr.tidyverse.org/|2014||
|JupyterLab|https://github.com/jupyterlab/jupyterlab|2014|https://en.wikipedia.org/wiki/Project_Jupyter|
|OmniSci|https://www.omnisci.com/|2013|https://en.wikipedia.org/wiki/OmniSci|
|xlwings|https://www.xlwings.org/|2013||
|RAWGraphs|https://github.com/rawgraphs/raw|2013||
|DataBricks|https://databricks.com/|2013|https://en.wikipedia.org/wiki/Databricks|
|Julia|https://julialang.org/|2012|https://en.wikipedia.org/wiki/Julia_(programming_language)|
|Looker|https://looker.com/|2012|https://en.wikipedia.org/wiki/Looker_(company)|
|AirTable|https://airtable.com/|2012|https://en.wikipedia.org/wiki/Airtable|
|Anaconda|https://www.anaconda.com/|2012|https://en.wikipedia.org/wiki/Anaconda_(Python_distribution)|
|Plotly|https://plot.ly/|2012|https://en.wikipedia.org/wiki/Plotly|
|DataWrapper|https://www.datawrapper.de/|2012||
|RStudio|https://www.rstudio.com/|2011|https://en.wikipedia.org/wiki/RStudio|
|Microsoft SandDance|https://github.com/microsoft/SandDance|2011|https://en.wikipedia.org/wiki/Microsoft_Garage|
|Microsoft PowerBI|https://powerbi.microsoft.com/en-us/|2011|https://en.wikipedia.org/wiki/Power_BI|
|d3|https://d3js.org/|2011|https://en.wikipedia.org/wiki/D3.js|
|Google Kaggle|https://www.kaggle.com/|2010|https://en.wikipedia.org/wiki/Kaggle|
|ChartIO|https://chartio.com/|2010||
|Google BigQuery|https://cloud.google.com/bigquery/|2010|https://en.wikipedia.org/wiki/BigQuery|
|Wolfram Alpha|https://www.wolframalpha.com/|2009|https://en.wikipedia.org/wiki/Wolfram_Alpha|
|LucidChart|https://www.lucidchart.com/|2008|https://en.wikipedia.org/wiki/Lucidchart|
|Pandas|https://pandas.pydata.org/|2008|https://en.wikipedia.org/wiki/Pandas_(software)
|Apple Numbers|https://www.apple.com/numbers/|2007|https://en.wikipedia.org/wiki/Numbers_(spreadsheet)|
|scikit-learn|https://scikit-learn.org/stable/|2007|https://en.wikipedia.org/wiki/Scikit-learn|
|Smartsheet|https://www.smartsheet.com/|2006|https://en.wikipedia.org/wiki/Smartsheet|
|Google Sheets|https://www.google.com/sheets/about/|2006|https://en.wikipedia.org/wiki/Google_Sheets|
|Alteryx|https://www.alteryx.com/|2006|https://en.wikipedia.org/wiki/Alteryx|
|RapidMiner|https://rapidminer.com/|2006|https://en.wikipedia.org/wiki/RapidMiner|
|Sisense|https://www.sisense.com/|2004|https://en.wikipedia.org/wiki/Sisense|
|KNIME|https://www.knime.com/|2004|https://www.knime.com/|
|Matplotlib|https://matplotlib.org/|2003|https://en.wikipedia.org/wiki/Matplotlib|
|Tableau|https://www.tableau.com/|2003|https://en.wikipedia.org/wiki/Tableau_Software|
|Visual-Paradigm Chart Maker|https://online.visual-paradigm.com/features/chart-maker/pyramid-chart-maker/|2002|https://en.wikipedia.org/wiki/Visual_Paradigm|
|NumPy|https://www.numpy.org/|1995||https://en.wikipedia.org/wiki/NumPy|
|Qlik|https://www.qlik.com/|1993|https://en.wikipedia.org/wiki/Qlik|
|JMP|https://www.jmp.com/|1989|https://en.wikipedia.org/wiki/JMP_(statistical_software)|
|Mathematica|http://www.wolfram.com/mathematica/|1988|https://en.wikipedia.org/wiki/Wolfram_Mathematica|
|Microsoft Excel|https://products.office.com/en-us/excel|1987|https://en.wikipedia.org/wiki/Microsoft_Excel|
|MATLAB|http://mathworks.com/products/matlab|1984|https://en.wikipedia.org/wiki/MATLAB|
|SAS|https://www.sas.com/|1976|https://en.wikipedia.org/wiki/SAS_language|
|SPSS|https://www.ibm.com/us-en/marketplace/spss-statistics|1968|https://en.wikipedia.org/wiki/SPSS|

## How to Give Feedback

Open an issue here, post to the [Ohayo subreddit](https://www.reddit.com/r/ohayocomputer), the [Tree Notation subreddit](https://www.reddit.com/r/treenotation/) or email ohayo@treenotation.org.

## Unlicense

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
