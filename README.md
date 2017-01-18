# Plinth
Plinth: a raised platform in a large room or hall that people stand on when performing or speaking to an audience.

Provides common and advanced features for use in simple to rich presentation layer sites and web applications. The design inclines towards addressing style complexity that arises thought normal design churn.

## Scope
This project prescribes an approach for organizing style values into specific configuration structures and provides SASS utilities for interacting with those structures.

This project will not extend to providing HTML templates or Javascript helper functions.

Browser compatibility will be limited to the most up-to-date version of each major browser. No attempt will be made to provide any compatibility beyond this.

## Usage
A consuming project must import `Plinth.scss` and provide it's own configuration as detailed in the following subsections.

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

The idea here is to provide a large number of defined colors to choose from for your needs. Then we reference these colors by usage as follows:

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

The thinking behind the design is that the usage of a color will alter over time, while the original color is still in use in other parts of the code. This makes usage of a single layer, or a variable based design, require larger code adjustments over time.

### Typography
There are two typographic structures available for implementing text types. There are no specific restrictions that enforces a that any specific declaration be placed in one structure or the other. It is, however, advised that the declarations be divided into one batch that defines the font and another that defines the usage of the font.

The design intention is to place the definition declarations in the `$fontPallets` structure as follows:
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

Actual usage of these two structures is to reference the `font` and `typeset` mixins as follows:
```
h1 {
  @include font (openSansBoldItallic);
  @include typeset (mainHeading);
}
```
