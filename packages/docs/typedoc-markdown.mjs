// @ts-check
import fs from 'node:fs/promises'
import path from 'node:path'
import { Application, TSConfigReader, PageEvent } from 'typedoc'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

/** @satisfies {Partial<import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions>} */
const DEFAULT_OPTIONS = {
  cleanOutputDir: true,
  excludeInternal: true,
  out: path.resolve(__dirname, './api'),
  entryFileName: 'index.md',
  // hideBreadcrumbs: false,
  preserveAnchorCasing: true,
}

/**
 *
 * @param {Partial<import('typedoc').TypeDocOptions>} config
 */
export async function createTypeDocApp(config = {}) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...config,
  }

  const app = await Application.bootstrapWithPlugins(options)

  // If you want TypeDoc to load tsconfig.json / typedoc.json files
  app.options.addReader(new TSConfigReader())

  app.renderer.on(
    PageEvent.END,
    /**
     *
     * @param {import('typedoc').PageEvent} page
     */
    (page) => {
      if (!page.contents) {
        return
      }
      page.contents = prependYAML(page.contents, {
        // TODO: figure out a way to point to the source files?
        editLink: false,
      })
    }
  )

  async function serve() {
    app.convertAndWatch(handleProject)
  }

  async function build() {
    if (
      (await exists(options.out)) &&
      (await fs.stat(options.out)).isDirectory()
    ) {
      await fs.rm(options.out, { recursive: true })
    }
    const project = await app.convert()
    return handleProject(project)
  }

  /**
   *
   * @param {import('typedoc').ProjectReflection | undefined} project
   */
  async function handleProject(project) {
    if (project) {
      // Rendered docs
      try {
        await app.generateOutputs(project)
        app.logger.info(`generated at ${options.out}.`)
      } catch (error) {
        app.logger.error(error)
      }
    } else {
      app.logger.error('No project')
    }
  }

  return {
    build,
    serve,
  }
}

async function exists(path) {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

/**
 * @typedef {Record<string, string | number | boolean>} FrontMatterVars
 */

/**
 * Prepends YAML block to a string
 * @param {string} contents - string to prepend to
 * @param {FrontMatterVars} vars - object of required front matter variables
 */
function prependYAML(contents, vars) {
  return contents
    .replace(/^/, toYAML(vars) + '\n\n')
    .replace(/[\r\n]{3,}/g, '\n\n')
}

/**
 * Converts YAML object to a YAML string
 * @param {FrontMatterVars} vars
 */
function toYAML(vars) {
  const yaml = `---
${Object.entries(vars)
  .map(
    ([key, value]) =>
      `${key}: ${
        typeof value === 'string' ? `"${escapeDoubleQuotes(value)}"` : value
      }`
  )
  .join('\n')}
---`
  return yaml
}

/**
 * Escapes double quotes in a string
 * @param {string} str - string to escape
 */
function escapeDoubleQuotes(str) {
  return str.replace(/"/g, '\\"')
}
