# vite-react

A personal project template - React 19 on Vite 8 with a modern, opinionated toolchain.

## Stack

| Area           | Tool                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| UI             | [React 19](https://react.dev)                                                                                                   |
| Compiler       | [React Compiler](https://react.dev/learn/react-compiler) - automatic memoization                                                |
| Build          | [Vite 8](https://vite.dev) + [Rolldown](https://rolldown.rs)                                                                    |
| Language       | [TypeScript 6](https://www.typescriptlang.org) + [ts-reset](https://www.totaltypescript.com/ts-reset)                           |
| Styling        | [Tailwind CSS 4](https://tailwindcss.com)                                                                                       |
| Formatter      | [oxfmt](https://github.com/nicolo-ribaudo/oxfmt)                                                                                |
| Linter (JS/TS) | [oxlint](https://oxc.rs/docs/guide/usage/linter)                                                                                |
| Linter (CSS)   | [Stylelint](https://stylelint.io) + [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard)         |
| Unit tests     | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com)                                                   |
| E2E tests      | [Playwright](https://playwright.dev)                                                                                            |
| Git hooks      | [Lefthook](https://lefthook.dev)                                                                                                |
| Commit style   | [commitlint](https://commitlint.js.org) + [commitizen](https://commitizen-tools.github.io/commitizen/) (conventional commits)   |
| Unused deps    | [knip](https://knip.dev)                                                                                                        |
| Editor config  | [EditorConfig](https://editorconfig.org) + [editorconfig-checker](https://github.com/editorconfig-checker/editorconfig-checker) |

## Scripts

```sh
pnpm dev              # start dev server
pnpm build            # type-check + bundle
pnpm preview          # build + serve locally

pnpm fix              # lint --fix + format (write)
pnpm check            # types + format + lint (read-only)
pnpm deepcheck        # check + editorconfig + package.json + deps

pnpm test             # unit tests (bail on first failure)
pnpm test:watch       # unit tests in watch mode
pnpm test:cov         # unit tests with coverage
pnpm test:e2e         # Playwright E2E (chromium)
pnpm test:related     # tests related to changed files (used in pre-push hook)

pnpm commit           # interactive conventional commit via commitizen

pnpm deps:check       # find unused/missing deps (knip)
pnpm deps:update      # interactive dependency upgrade
pnpm deps:circular    # detect circular imports (requires madge)

pnpm build:bundle-viz # build + emit bundle analysis (dist/bundle-analysis.md)
pnpm build:clean      # remove dist, build, .turbo
pnpm build:nuke       # clean + remove lockfile + node_modules + reinstall
```
