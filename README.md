# scottcomm-progressive-image

A reusable React progressive image component.

It renders a blurred thumbnail first, lazy-loads the full image when visible, and swaps to a fallback icon when the full image is missing or errors.

## Features

- Progressive loading with blur thumb -> full image transition
- IntersectionObserver visibility trigger with preload margin
- Fallback rendering for empty or broken full-size images
- Thumb failure isolation (thumb can fail without hiding full image)
- TypeScript types included

## How Lazy Loading Works

1. The component mounts a wrapper element and watches it with `IntersectionObserver`.
2. The full image is not rendered until the wrapper is near/in view (`rootMargin: 100px`).
3. When visible, the thumb (if provided) and full image are rendered.
4. On full image `load`, the component calls `HTMLImageElement.decode()` when available.
5. The full image is shown only after decode completes (or immediately after `load` on browsers without `decode`).

This means visibility controls network/render timing, and `decode()` helps avoid showing a partially decoded full image.

## Install

```bash
pnpm add scottcomm-progressive-image
```

or

```bash
npm i scottcomm-progressive-image
```

## Usage

```tsx
import ProgressiveImage from "scottcomm-progressive-image";
import "scottcomm-progressive-image/styles.css";

export function Example() {
  return (
    <ProgressiveImage
      fullSrc="https://example.com/full.jpg"
      thumbSrc="https://example.com/thumb.jpg"
      alt="Example image"
      className="my-image"
    />
  );
}
```

## API

`ProgressiveImageProps`

- `alt?: string`
- `className?: string`
- `fullSrc?: string`
- `fullStyle?: React.CSSProperties`
- `thumbSrc?: string`
- `thumbStyle?: React.CSSProperties`
- `title?: string`

## Local Development

```bash
pnpm install
pnpm test:run
pnpm build
```

## Publish in a New Repo

1. Copy `packages/progressive-image` into a new git repository root.
2. Optionally rename the package in `package.json` (`name`, `repository`, `author`).
3. Run `pnpm install`.
4. Build and test:

```bash
pnpm test:run
pnpm build
```

5. Publish:

```bash
npm publish --access public
```

## License

MIT
