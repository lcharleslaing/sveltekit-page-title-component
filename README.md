# SvelteKit Page Title Component

This package provides a `PageTitle` Svelte component that automatically updates the document title with the name of the current page. It is intended for use in SvelteKit projects.

## Installation

You can install this package using npm:

```
npm i sveltekit-page-title-component
```

## Usage

```
npx sveltekit-page-title-component
```

The `<PageTitle />` component, will automatically be added to all `+page.svelte` files.

If it already exists, it will not be added.

If the `<script></script>` tag does not exist, it will be added to the `+page.svelte` files.

```html
<script>
  import PageTitle from "sveltekit-page-title-component";
</script>
```

<PageTitle />

You can also set a custom title for the page by passing a customTitle prop:

```html
<PageTitle customTitle="Custom Title"/>
```

## Contributing

If you find a bug or want to suggest a new feature, feel free to open an issue on the GitHub repository. Pull requests are also welcome.

## License

This package is licensed under the MIT License.
