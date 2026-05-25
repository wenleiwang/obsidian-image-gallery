import { Plugin } from 'obsidian'
import { imgGalleryInit } from './init';
import { ImgGallerySettingTab, DEFAULT_SETTINGS, ImgGalleryPluginSettings } from './settings'

export default class ImgGallery extends Plugin {
  settings: ImgGalleryPluginSettings

  async onload() {
    await this.loadSettings()
    this.addSettingTab(new ImgGallerySettingTab(this.app, this))

    this.registerMarkdownCodeBlockProcessor('img-gallery', (src, el, ctx) => {
      const handler = new imgGalleryInit(this, src, el, this.app)
      ctx.addChild(handler)
    })
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}
