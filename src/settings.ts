import { App, PluginSettingTab, Setting, normalizePath } from 'obsidian'
import type ImgGallery from './main'

const electronShell = (window as any).require('electron').shell

const CACHE_DIR = '.img-gallery-cache'

export interface ImgGalleryPluginSettings {
  cacheDays: number
}

export const DEFAULT_SETTINGS: ImgGalleryPluginSettings = {
  cacheDays: 7,
}

export class ImgGallerySettingTab extends PluginSettingTab {
  plugin: ImgGallery

  constructor(app: App, plugin: ImgGallery) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this
    containerEl.empty()

    containerEl.createEl('h2', { text: 'Image Gallery / 图片画廊' })

    new Setting(containerEl)
      .setName('Cache expiration (days) / 缓存过期天数')
      .setDesc('Cached network images older than this will be re-downloaded. Default: 7 days. / 超过该天数的缓存图片将被重新下载，默认 7 天。')
      .addText(text => text
        .setPlaceholder('7')
        .setValue(String(this.plugin.settings.cacheDays))
        .onChange(async (value) => {
          const num = parseInt(value, 10)
          if (isNaN(num) || num < 1) return
          this.plugin.settings.cacheDays = num
          await this.plugin.saveSettings()
        }))

    new Setting(containerEl)
      .setName('Clear cache / 清除缓存')
      .setDesc('Delete all cached network images. / 删除所有缓存的网络图片。')
      .addButton(button => button
        .setButtonText('Clear / 清除')
        .onClick(async () => {
          await this.clearCache()
          button.setButtonText('Done / 已清除')
          setTimeout(() => button.setButtonText('Clear / 清除'), 2000)
        }))

    new Setting(containerEl)
      .setName('Cache info / 缓存信息')
      .setDesc('Loading... / 加载中...')
      .addButton(button => button
        .setButtonText('Open / 打开')
        .onClick(() => {
          const fullPath = (this.app.vault.adapter as any).getFullPath(normalizePath(CACHE_DIR))
          electronShell.openPath(fullPath)
        }))
      .then(async (setting) => {
        const info = await this.getCacheInfo()
        setting.setDesc(info)
      })
  }

  async clearCache(): Promise<void> {
    try {
      const exists = await this.app.vault.adapter.exists(CACHE_DIR)
      if (exists) {
        await this.app.vault.adapter.rmdir(CACHE_DIR, true)
      }
    } catch (_) {}
  }

  async getCacheInfo(): Promise<string> {
    try {
      const exists = await this.app.vault.adapter.exists(CACHE_DIR)
      if (!exists) return 'No cached images / 暂无缓存图片'

      const files = await this.app.vault.adapter.list(CACHE_DIR)
      let totalSize = 0
      for (const file of files.files) {
        const stat = await this.app.vault.adapter.stat(file)
        if (stat?.size) totalSize += stat.size
      }
      const sizeMB = (totalSize / (1024 * 1024)).toFixed(2)
      return `${files.files.length} files / ${files.files.length} 个文件，${sizeMB} MB`
    } catch (_) {
      return 'Unable to read cache / 无法读取缓存信息'
    }
  }
}
