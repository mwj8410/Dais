# Dais
Dais: a raised platform in a large room or hall that people stand on when performing or speaking to an audience.

Provides common and advanced features for use in rich User-Experience sites and web applications.

## Scope
This project will attempt to collect together common style, component, and utility features in Sass, Javascript, and HTML.
At this time, no layout control library or framework like Angular or React will be in use at this time. Client side
compatability will be limited to the most up-to-date version of each major browser. No attempt will be made to provide
any compatability beyond this.

## Usage
A consuming project needs to import either `scaffolding.scss` or `_main.scss` into it's sass project.
Alternatively, if only portions of the project are needed, each individual module of the library may be imported as needed.
All configuration and modification should be conducted by importing and altering the values in `_config.scss`, then
importing `_main.scss`. In the case of individual modules, only the associated sections indicated by comments in the
`_config.scss` file. Further documentation to follow.

### Layout
In progress.

There are two obvious approaches: static diminsion elements or flex elements. Either way, a direction must be selected,
verticle or horizontal.

An additional method is possible that involves tiling. If this is in use, then a tile bust know how many cells in a
single direction that it will make use of. It, under no circumstance, can make use of a non-rectagular shape of cells.

### Palette
Color palettes are expressed and referenced in suce a way as to be as compatible as plausable with known UI/UX terminology.

The required structure, mus be mounted in the '$colorPalettes' variable. This is a map structure where each key is
intended to represent a named palette and each value within t hat map is a key value pair where the key is the name of
the color name within the pallet.

```
$colorPalettes: (
  example: (
    one: red,
    two: green,
    three: blue
  )
);'
```

### Typography
There are two typographic structures available for implimenting text types. There are no specific restrictions that
enforces a that any specific declaration be placed in one structure or the other. It is, however, advised that the
declerations be divided into one batch that defines the font and another that defines the usage of the font.

The design intention is to place the definition declerations in the `$fontPallets` structure as follows:
```
$fontPalettes: (
  openSansBoldItallic: (
    font-family: 'Open Sans',
    font-style: italic,
    font-weight: 600
  )
);
```

The `$typeSets` structure is intended for usage based rules as follows:
```
$typeSets: (
  mainHeading: (
    color: #f0f,
    font-size: 72px,
    letter-spacing: -0.5px,
    line-height: 72px
  )
);
```

Actual usage of these two structures is to referrence the `font` and `typeset` mixins as follows:
```
h1 {
  @include font (openSansBoldItallic);
  @include typeset (mainHeading);
}
```
