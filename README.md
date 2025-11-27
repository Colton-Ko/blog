# Blog

A simple blog built on Astro that supports hosting on Cloudflare pages.

## Features

This demo showcases the following markdown capabilities:

- ✅ **Mermaid diagrams** - Flowcharts, sequence diagrams, class diagrams, etc.
- ✅ **Highlighting** - Using `==text==` syntax
- ✅ **Keyboard keys** - Using `<kbd>` HTML tags
- ✅ **Subscripts** - Using `~text~` syntax (e.g., H~2~O)
- ✅ **Superscripts** - Using `^text^` syntax (e.g., x^2^)
- ✅ **Math (LaTeX)** - Both inline `$...$` and display `$$...$$` math using KaTeX

## Getting Started

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deploying to Cloudflare Pages

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Log in to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Create a new project and connect your repository
4. Configure the build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: 18 or higher
5. Deploy!

Cloudflare Pages will automatically rebuild your site on every push to your repository.

## Project Structure

```text
/
├── public/              # Static assets
├── src/
│   ├── layouts/
│   │   └── Layout.astro # Base layout with KaTeX CSS and styling
│   └── pages/
│       ├── index.astro  # Homepage
│       └── posts/
│           └── sample.md # Sample blog post with all features
├── astro.config.mjs     # Astro configuration with remark/rehype plugins
└── package.json
```

## Markdown Plugins Used

- `remark-math` + `rehype-katex` - LaTeX math rendering
- `rehype-mermaid` - Mermaid diagram rendering (inline SVG)
- `remark-mark` - Highlighting support
- `remark-sub-super` - Subscript and superscript support

## Writing Blog Posts

Create new markdown files in `src/pages/posts/`. Each file should have frontmatter:

```markdown
---
layout: ../../layouts/Layout.astro
title: "Your Post Title"
---

# Your Post Title

Your content here...
```

See `src/pages/posts/sample.md` for examples of all supported features.

## TypeScript Warnings

You may see TypeScript warnings about missing type definitions for `remark-mark` and `remark-sub-super`. These are cosmetic and don't affect functionality. The plugins work correctly at runtime.

## License

MIT
