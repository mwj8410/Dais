# sass_scaffolding
Provides Sass utilities and structures for common style needs.

## Scope
This project will limit it's scope to style accessable activities. Any javascript related UI operations are outside the
scope of this project.

## Usage
A consuming project needs to import either `scaffolding.scss` or `_main.scss` into it's sass project.
Alternatively, if only portions of the project are needed, each individual module of the library may be imported as needed.
All configuration and modification should be conducted by importing and altering the values in `_config.scss`, then importing `_main.scss`.
In the case of individual modules, only the associated sections indicated by comments in the `_config.scss` file. Further documentation to follow.

### Layout

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
