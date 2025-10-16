# Valaxy Blog - AI Coding Agent Instructions

This document provides instructions for AI coding agents to effectively contribute to this Valaxy-based blog.

## Project Overview

This is a personal blog built with [Valaxy](https://valaxy.site/), a static site generator powered by Vite and Vue. It uses the [`valaxy-theme-yun`](https://yun.valaxy.site/) theme. The content is written in Markdown.

### Key Technologies

- **Framework**: Valaxy, Vue 3
- **Build Tool**: Vite
- **Language**: TypeScript, Markdown
- **Styling**: SCSS, UnoCSS (via `valaxy-theme-yun`)
- **Deployment**: GitHub Pages, Netlify, Vercel

## Architecture & Conventions

The project follows the standard Valaxy directory structure.

- `valaxy.config.ts`: Main configuration for the Valaxy site. This includes theme configuration, addon setup (like comments and analytics), and global metadata.
- `site.config.ts`: Contains site-specific data like navigation links, social URLs, and author information. This data is consumed by the theme.
- `pages/`: All website content resides here as Markdown files. The directory structure directly maps to the website's routes.
  - Blog posts are in `pages/posts/`.
  - Special pages like "About" or "Links" have their own directories.
- `components/`: Custom Vue components that override or extend the `valaxy-theme-yun` theme. For example, `YunFooter.vue` is a custom footer.
- `layouts/`: Custom page layouts. `layouts/albums.vue` is a significant custom layout that provides a calendar-based gallery view.
- `styles/`: For custom styling.
  - `vars.scss`: Overrides default theme CSS variables.
  - `index.scss`: For adding new global styles.
- `public/`: Static assets like images, favicons, and `CNAME` file.
- `locales/`: Contains translation files for internationalization (i18n), with `en.yml` and `zh-CN.yml`.

### Custom Feature: Albums Layout

The `layouts/albums.vue` file is a custom feature that displays a calendar grid.
- It fetches all pages under `/albums/` and groups them by date.
- Days with an album are highlighted and link to the corresponding album page.
- It includes a simple password protection mechanism configured via the page's frontmatter (`password` or `gallery_password`).

When working with the albums feature, you'll likely need to edit `layouts/albums.vue` for layout/logic changes, or the markdown files in `pages/albums/` for content.

## Developer Workflow

### Prerequisites

This project uses `pnpm` as the package manager.

- Install dependencies: `pnpm install`

### Common Commands

The following scripts are defined in `package.json`:

- **`pnpm dev`**: Starts the local development server with hot-reloading. The site will be available at `http://localhost:4859`.
- **`pnpm build`**: Builds the static site for production. The output is generated in the `dist` directory. This uses Static Site Generation (SSG).
- **`pnpm serve`**: Previews the locally built production site.
- **`pnpm deploy`**: Deploys the site to GitHub Pages. It runs the build script and then pushes the `dist` directory to the `gh-pages` branch.

### Creating Content

- To create a new blog post, add a new Markdown file to `pages/posts/`.
- To create a new album, add a new Markdown file to `pages/albums/`. Make sure to include a `date` field in the frontmatter.

Example frontmatter for an album page (`pages/albums/my-album.md`):

```markdown
---
title: My Album
date: 2023-10-26
---

This is my new album.
<!-- more -->
...gallery content...
```
