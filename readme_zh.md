[English](README.md) | [中文](readme_zh.md)

![Obsidian Image Gallery](assets/obsidian-image-gallery-header.jpg)

# Obsidian Image Gallery

Obsidian Image Gallery 是一个零配置的瀑布流图片画廊插件，适用于 [Obsidian](https://obsidian.md/)。

**目录**
- [环境要求](#环境要求)
- [安装](#安装)
- [使用方式](#使用方式)
- [配置项](#配置项)
- [插件设置](#插件设置)
- [注意事项](#注意事项)
- [示例](#示例)
- [更新日志](#更新日志)
- [致谢](#致谢)
- [许可证](#许可证)
- [联系方式](#联系方式)

## 环境要求

- [Obsidian](https://obsidian.md/) `(ver >= 1.1.8)`
- 本地图片文件夹（位于你的 vault 中），或网络图片链接

## 安装

与其他社区插件一样，在 Obsidian 内部即可安装 Obsidian Image Gallery。详见[官方文档](https://help.obsidian.md/Advanced+topics/Community+plugins#Discover+and+install+community+plugins)。

## 使用方式

在笔记中插入以下代码块即可创建动态画廊（记得替换路径）：

水平瀑布流：
````
```img-gallery
path: Attachments/Folder
type: horizontal
```
````

垂直瀑布流：
````
```img-gallery
path: Attachments/Folder
type: vertical
```
````

网络图片（可选设置缓存天数）：
````
```img-gallery
url:
  - https://example.com/photo1.jpg
  - https://example.com/photo2.jpg
type: horizontal
cache: 7
```
````

更多定制选项见[配置项](#配置项)章节，上述示例为最简配置。

在 *[实时预览](https://help.obsidian.md/Live+preview+update)* 模式下，光标移出代码块即可生成画廊。在 *源码模式* 下，按 `cmd+e`（或 `ctrl+e`）触发 Obsidian 的笔记预览。

![Obsidian Image Gallery - Animation](assets/obsidian-image-gallery.gif)

`1.1.1` 引入了灯箱浏览功能，点击画廊中的任意图片即可打开。如需查看原图，点击右上角按钮即可在新标签页中打开。

![Obsidian Image Gallery - Animation](assets/obsidian-image-gallery-lightbox.jpg)

## 配置项

配置项可在代码块中按任意顺序以 `yaml` 语法书写。可选属性默认值如下表所示：

| 配置项   | 默认值       | 可选值          | 必填   | 说明                         |
| -------- | ------------ | --------------- | ------ | ---------------------------- |
| `path`   | -            | -               | 是*    | 相对于 vault 根目录的路径    |
| `url`    | -            | -               | 是*    | 网络图片链接列表             |
| `type`   | `horizontal` | `vertical`      | 否     | 瀑布流类型                   |
| `gutter` | `8`          | （任意数字）    | 否     | 图片间距（px）               |
| `radius` | `0`          | （任意数字）    | 否     | 图片圆角（px）               |
| `sortby` | `ctime`      | `mtime`、`name` | 否     | 排序依据                     |
| `sort`   | `desc`       | `asc`           | 否     | 排序方向                     |
| `cache`  | 插件全局设置 | （任意数字）    | 否     | 网络图片缓存天数，覆盖插件默认值 |

\* `path` 和 `url` 二选一必填。

仅 `type=horizontal` 时生效：

| 配置项   | 默认值 | 可选值       | 必填 | 说明           |
| -------- | ------ | ------------ | ---- | -------------- |
| `height` | `260`  | （任意数字） | 否   | 每行高度（px） |

仅 `type=vertical` 时生效：

| 配置项    | 默认值 | 可选值       | 必填 | 说明             |
| --------- | ------ | ------------ | ---- | ---------------- |
| `columns` | `3`    | （任意数字） | 否   | 桌面端列数       |
| `mobile`  | `1`    | （任意数字） | 否   | 移动端列数       |

## 插件设置

在 Obsidian 的 `设置 → Image Gallery` 中提供全局配置：

- **缓存过期天数**：网络图片缓存的默认过期时间。代码块中的 `cache` 配置项会覆盖此值。默认 7 天。
- **清除缓存**：一键删除所有缓存的网络图片。
- **缓存信息**：显示当前缓存文件数量和大小，可点击 `Open` 在系统文件管理器中打开缓存文件夹。

## 注意事项
- `path` 无需填写 vault 名称
- 网络图片会自动下载到 vault 根目录的 `.img-gallery-cache/` 文件夹中缓存，过期后重新下载
- 图片尺寸应合理：用 60 张 4K 照片生成瀑布流很可能让应用卡死

关于瀑布流方向与图片分布：在原生 `css` 网格[支持真正的瀑布流布局](https://drafts.csswg.org/css-grid-3/)之前，垂直版本的排序效果时好时坏。这是因为元素流是从上到下的（详见[这篇文章](https://css-tricks.com/piecing-together-approaches-for-a-css-masonry-layout)）。如果排序很重要，建议使用水平版本；其图片有时会被裁切，但排序更直观。

## 示例
![Obsidian Image Gallery - Examples](assets/obsidian-image-gallery-examples.jpg)

## 更新日志

`1.2.0`
  - 新增网络图片支持（url 配置项）
  - 新增图片缓存机制，可配置过期天数（默认 7 天）
  - 新增插件设置页面，支持缓存控制

`1.1.1`
  - 修复了"在新标签页中打开图片"功能的 bug

`1.1.0`
  - 修复了字母排序
  - 桌面端和移动端均引入灯箱功能
  - 灯箱中增加"在新标签页中打开图片"按钮
  - 修复 README.md 文件名大小写问题

## 致谢
头图中的所有照片均由多位摄影师拍摄，来源于 [Unsplash](https://unsplash.com/s/photos/architecture)。

## 许可证
![https://github.com/lucaorio/obsidian-image-gallery/blob/master/license](https://img.shields.io/badge/license-MIT-blue.svg)

## 联系方式
- Twitter: [@lucaorio_](http://twitter.com/@lucaorio_)
- 网站: [lucaorio.com](http://lucaorio.com)
- 邮箱: [luca.o@me.com](mailto:luca.o@me.com)
