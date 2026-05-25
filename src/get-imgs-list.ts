import { App, TFolder, TFile } from 'obsidian'
import renderError from './render-error'

const getImagesList = async (
    app: App,
    container: HTMLElement,
    settings: {[key: string]: any}
  ) => {
  if (settings.url) {
    return getNetworkImages(app, container, settings)
  }
  if (settings.path) {
    return getVaultImages(app, container, settings)
  }

  const error = 'Please specify a path or a list of urls!'
  renderError(container, error)
  throw new Error(error)
}

const getVaultImages = (
    app: App,
    container: HTMLElement,
    settings: {[key: string]: any}
  ) => {
  const folder = app.vault.getAbstractFileByPath(settings.path)

  let files
  if (folder instanceof TFolder) { files = folder.children }
  else {
    const error = 'The folder doesn\'t exist, or it\'s empty!'
    renderError(container, error)
    throw new Error(error)
  }

  const validExtensions = ["jpeg", "jpg", "gif", "png", "webp", "tiff", "tif"]
  const images = files.filter(file => {
    if (file instanceof TFile && validExtensions.includes(file.extension)) return file
  })

  const orderedImages = images.sort((a: any, b: any) => {
    const refA = settings.sortby === 'name' ? a['name'].toUpperCase() : a.stat[settings.sortby]
    const refB = settings.sortby === 'name' ? b['name'].toUpperCase() : b.stat[settings.sortby]
    return (refA < refB) ? -1 : (refA > refB) ? 1 : 0
  })

  const sortedImages = settings.sort === 'asc' ? orderedImages : orderedImages.reverse()

  return sortedImages.map(file => {
    return {
      name: file.name,
      folder: file.parent.path,
      uri: app.vault.adapter.getResourcePath(file.path)
    }
  })
}

const getNetworkImages = async (
    app: App,
    container: HTMLElement,
    settings: {[key: string]: any}
  ) => {
  const cacheDays = settings.cache ?? 7
  const cacheMs = cacheDays * 24 * 60 * 60 * 1000
  const cacheDir = '.img-gallery-cache'

  await cleanExpiredCache(app, cacheDir, cacheMs)

  const results = await Promise.all(
    settings.url.map(async (url: string) => {
      const name = url.split('/').pop()?.split('?')[0] || 'image'
      const cacheKey = btoa(url).replace(/[/+=]/g, '_')
      const cachePath = `${cacheDir}/${cacheKey}-${name}`

      try {
        const cached = await getCachedUri(app, cachePath, cacheMs)
        if (cached) {
          return { name, url, folder: '', uri: cached }
        }
      } catch (_) {}

      try {
        const buffer = await downloadImage(url)
        await saveToCache(app, cachePath, buffer)
        const cachedUri = app.vault.adapter.getResourcePath(cachePath)
        return { name, url, folder: '', uri: cachedUri }
      } catch (_) {
        return { name, url, folder: '', uri: url }
      }
    })
  )

  return results.filter(img => img !== null)
}

const getCachedUri = async (app: App, cachePath: string, cacheMs: number): Promise<string | null> => {
  const exists = await app.vault.adapter.exists(cachePath)
  if (!exists) return null

  const stat = await app.vault.adapter.stat(cachePath)
  if (!stat || !stat.mtime) return null

  const age = Date.now() - stat.mtime
  if (age > cacheMs) {
    await app.vault.adapter.remove(cachePath)
    return null
  }

  return app.vault.adapter.getResourcePath(cachePath)
}

const downloadImage = async (url: string): Promise<ArrayBuffer> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch ${url}`)
  return response.arrayBuffer()
}

const saveToCache = async (app: App, cachePath: string, buffer: ArrayBuffer): Promise<void> => {
  const dir = cachePath.substring(0, cachePath.lastIndexOf('/'))
  const dirExists = await app.vault.adapter.exists(dir)
  if (!dirExists) {
    await app.vault.adapter.mkdir(dir)
  }
  await app.vault.adapter.writeBinary(cachePath, buffer)
}

const cleanExpiredCache = async (app: App, cacheDir: string, cacheMs: number): Promise<void> => {
  try {
    const exists = await app.vault.adapter.exists(cacheDir)
    if (!exists) return

    const files = await app.vault.adapter.list(cacheDir)
    for (const file of files.files) {
      const stat = await app.vault.adapter.stat(file)
      if (stat?.mtime && Date.now() - stat.mtime > cacheMs) {
        await app.vault.adapter.remove(file)
      }
    }
  } catch (_) {}
}

export default getImagesList
