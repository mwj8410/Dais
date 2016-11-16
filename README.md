# Plinth
Plinth: a raised platform in a large room or hall that people stand on when performing or speaking to an audience.

Provides common and advanced features for use in rich User-Experience sites and web applications. The design inclines
towards addressing style complexity that arises thought normal design churn.

## Scope
This project will attempt to collect together common style, component, and utility features in Sass, Javascript, and HTML.
At this time, no layout control library or framework like Angular or React will be in use. Client side compatability will
be limited to the most up-to-date version of each major browser. No attempt will be made to provide any compatability
beyond this.

## Usage
A consuming project needs to import either `Plinth.scss` or `_main.scss` into it's sass project.
Alternatively, if only portions of the project are needed, each individual module of the library may be imported as needed.
All configuration and modification should be conducted by importing and altering the values in `_config.scss`, then
importing `_main.scss`. In the case of individual modules, only the associated sections indicated by comments in the
`_config.scss` file. Further documentation to follow.

### Style

### Layout
In progress.

There are two obvious approaches: static diminsion elements or flex elements. Either way, a direction must be selected,
verticle or horizontal.

An additional method is possible that involves tiling. If this is in use, then a tile bust know how many cells in a
single direction that it will make use of. It, under no circumstance, can make use of a non-rectagular shape of cells.

#### Containers
A container is a class that wraps content in some sort of treatment. The most common type is a simple `.container`.

This class is informed by the configuration list `$containerBreakpoints` which indicates which breakpints represent
container width limits.

### Colors
Colors are a two layer system intended to provide the most robust expressability plausable with standardized accessors.

First, provide color pallets as follows:

```
$color-palettes: (
  grey: (
    50: #FAFAFA,
    100: #F5F5F5,
    200: #EEEEEE,
    300: #E0E0E0,
    400: #BDBDBD,
    500: #9E9E9E,
    600: #757575,
    700: #616161,
    800: #424242,
    900: #212121
  )
);
```

The idea here is to provide a lage number of defined colors to choose from for your needs. Then we reference these colors
by usage as follows:

```
$theme-colors: (
  container: (
    background: (grey, 500),
    foreground: (grey, 900),
    highlight: (grey, 50)
  )
);
```

The color can then be accessed using `color(container, background)`.

The thinking behind the design is that the usage of a color will alter over time, while the origional color is still in`
use in other parts of the code. This makes usage of a single layer, or a variable based design, require larger code
adjustments over time.

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
