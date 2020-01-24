# Ohayo the language

OhayoLang is a dataflow programming langauge for data science. Ohayo Lang runs in the browser or on the command line.

OhayoLang is not a general purpose programming language. OhayoLang is a [Tree Language](https://treenotation.org/) which means it uses a simple white-space syntax for structure.

## Quick Example

Here is a sample Ohayo program that shows the biggest telescopes in the world in a table:

    samples.telescopes
     tables.basic

## Tiles and Tables

Ohayo is made up of keywords called "tiles". They are called tiles because Ohayo is primarily a language for visual data science, and so each keyword has a visual representation. The program above has 2 tiles.

Ohayo has one primary data structure: typed tables. Every tile has access to its parent output table. Every tile can emit its own output table or pass through its parents. The columns can contain the basic primitive a like ints, floats, strings, dates, etc.

The below is a snippet from the output table of the "samples.iris" tile.

    Sepal.Length,Sepal.Width,Petal.Length,Petal.Width,Species
    5.1,3.5,1.4,0.2,setosa
    4.9,3,1.4,0.2,setosa
    4.7,3.2,1.3,0.2,setosa

Tiles can thus provide data, transform data, visualize data, etc.

## Adding new Tiles

Tiles are written in a hybrid of the Tree Language called Grammar and TypeScript/JavaScript. They can additional use external JavaScript libraries and css and manipulate their portion of the dom directly, so they can tap into great existing visualization libraries.

Tiles can define keywords within their scope so users can provide additional configuration if needed. In general the best practice is for the tile to self configure. AI will help more here in the future.

All Ohayo tiles are in a namespace. The period is the qualifier(open to suggestions). This aims to work like DNS or npm. Because Ohayo lacks most primitives and functionality of a general purpose language, it will only become very good if people write and contribute high level tiles which provide new data sets, new transformations, new visualizations, etc.

## Running Ohayo Programs on the Command Line

Ohayo programs are designed to be run visually in the browser but you can also run Ohayo programs headless on the command line for things like cron job reports and testing.

The program below:

    #! /usr/bin/env node /usr/local/bin/jtree
    samples.presidents
     filter.where HomeState = Illinois
      print.csv

Prints this output:

    name,number,link,TookOffice,Leftoffice,Party,HomeState
    Abraham Lincoln,16,http://en.wikipedia.org/wiki/Abraham_Lincoln,-3434275714000,-3304416514000,Republican/National Union,Illinois
    Barack Obama,44,http://en.wikipedia.org/wiki/Barack_Obama,1232445600000,NaN,  Democratic   ,Illinois

## Feedback

If you foresee any big stupid problems that will be a lot harder to fix in 2021 and beyond, please create an issue or get in touch.

Thanks for any and all feedback!

## Public domain

Ohayo is released to the public domain.
