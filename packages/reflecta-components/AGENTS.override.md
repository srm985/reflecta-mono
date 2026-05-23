# AGENTS.override.md

## Scope

This package contains the Reflecta shared React / TypeScript component library, Storybook stories, global SCSS design system, and Module Federation component exposure.

## Purpose

Treat this package as a reusable UI compatibility boundary.

- Prefer stable public component exports over deep internal imports.
- Keep component APIs intentional, typed, and reusable.
- Prefer `type` aliases over `interface` for new TypeScript shapes. Use `interface` only when declaration merging, extending an existing interface, or an established local pattern makes it the clearer choice.
- If a shared component prop contract changes, update affected `reflecta-ui` consumers in the same task when appropriate.
- Keep Storybook stories aligned with meaningful component states and usage patterns.

## Architecture

- Components live in `src/components/<Name>Component` with `index.tsx`, `types.ts`, optional `styles.scss`, and usually `stories.tsx`.
- Internal Storybook/dev-only helpers live under `src/components/_internal` and are intentionally excluded from Module Federation exposure.
- Component implementations usually set `Component.displayName` and build BEM-style class names from that display name via `@utils/classNames`.
- Global styles and design tokens live in `src/styles/*`; `RootStylingComponent` imports `@styles/styles.scss` so the UI can receive the component library's global SCSS.
- `src/App.tsx` is only a minimal dev shell that imports global styles.
- Webpack auto-discovers component directories, exposes each non-`_internal` component, and generates declaration files into `declarations`.

## Component constraints

- Avoid app-specific backend calls or product workflow logic inside shared components.
- Keep components presentational where practical.
- Preserve accessibility expectations, keyboard behavior, labels, and semantic markup.
- Prefer composition over adding highly specific props for one-off UI use cases.
- Keep styles consistent with existing design-system patterns.
- Avoid unnecessary duplication of type shapes already represented by public component props or shared exports.
- Prefer FontAwesome icons where existing components already do; this package currently depends on FontAwesome, not lucide.
- Components may accept application callbacks/data, but should not import UI store, UI routes, backend clients, or app-specific API constants.
- Components that use browser integrations, such as Google Places, should keep keys/config passed in as props.

## Module Federation caution

- Be careful with exposes, shared dependency settings, and build output.
- Do not rename exposed modules or public exports unless explicitly requested or required by the task.
- Keep React-related shared dependencies singleton-compatible when that is the established configuration.
- Call out any change that requires coordinated deployment of `reflecta-components` and `reflecta-ui`.
- The remote container name is `reflecta_components`; the generated `remoteEntry.js` is consumed by UI through the `FEDERATED_COMPONENTS_URL` setting.
- Adding/removing/renaming a component directory changes exposed modules and the declarations that UI uses to generate `@components/remotes/*` wrappers.
- CSS modules are only enabled for SCSS files matching `colors` or `units`; most component SCSS is global/BEM-style.

## Style System

- The base unit is `$planck-length: 8px`.
- Breakpoints and max widths are defined in `src/styles/_units.scss`.
- Color, font-size, spacing, and display utility classes are generated in `src/styles/_helpers.scss`.
- Use existing tokens from `_colors.scss`, `_spacings.scss`, `_stylings.scss`, `_fonts.scss`, and `_units.scss` before adding new values.
- Keep card radii, shadows, spacing, and responsive behavior aligned with the existing SCSS tokens.

## Style preferences

- Preserve readability and self-documenting names.
- Avoid needless helpers and over-abstraction.
- Avoid spaghetti code and deep chains of functions that primarily call other single-use functions.
- Prefer direct readable utilities unless abstraction materially improves reuse, testability, or understanding.
- Prefer pure utilities where practical.
- Preserve existing comments unless obsolete.
- Do not destructure props in the function signature; current components destructure inside the body.
- Follow existing alias usage (`@components`, `@styles`, `@utils`, `@constants`) rather than deep relative imports.

## Verification

Use best judgment, but for component-local work prefer:
- relevant lint and typecheck,
- targeted tests when available,
- Storybook validation when stories or component states change,
- package build validation when Module Federation exposes or build configuration changes,
- validating impacted `reflecta-ui` consumers when component contracts change.

Useful commands:
- `npm run lint -w reflecta-components`
- `npm run lint:js -w reflecta-components`
- `npm run lint:scss -w reflecta-components`
- `npm run build -w reflecta-components`
- `npm run storybook -w reflecta-components`
