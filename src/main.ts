import { Plugin, EditorSuggest, Editor, EditorPosition, TFile, EditorSuggestTriggerInfo, EditorSuggestContext } from 'obsidian'
import { emoji } from './emoji-list'
import { emojiProcessor } from './emoji-post-processor'
import { DEFAULT_SETTINGS, EmojiPluginSettings, EmojiPluginSettingTab } from './settings'

export default class EmojiShortcodesPlugin extends Plugin {
  settings!: EmojiPluginSettings

  async onload (): Promise<void> {
    await this.loadSettings()
    this.addSettingTab(new EmojiPluginSettingTab(this.app, this))
    this.registerEditorSuggest(new EmojiSuggester(this))
    this.registerMarkdownPostProcessor(emojiProcessor)
  }

  async loadSettings (): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings (): Promise<void> {
    await this.saveData(this.settings)
  }
}

class EmojiSuggester extends EditorSuggest<string> {
  plugin: EmojiShortcodesPlugin

  constructor (plugin: EmojiShortcodesPlugin) {
    super(plugin.app)
    this.plugin = plugin
  }

  onTrigger (cursor: EditorPosition, editor: Editor, _: TFile): EditorSuggestTriggerInfo | null {
    if (this.plugin.settings.suggester) {
      const sub = editor.getLine(cursor.line).substring(0, cursor.ch)
      const match = sub.match(/:\S+$/)?.first()
      if (match !== undefined) {
        return {
          end: cursor,
          start: {
            ch: sub.lastIndexOf(match),
            line: cursor.line
          },
          query: match
        }
      }
    }
    return null
  }

  getSuggestions (context: EditorSuggestContext): string[] {
    const emojiQuery = context.query.replace(':', '')
    return Object.keys(emoji).filter(p => p.includes(emojiQuery))
  }

  renderSuggestion (suggestion: string, el: HTMLElement): void {
    const outer = el.createDiv({ cls: 'ES-suggester-container' })
    outer.createDiv({ cls: 'ES-shortcode' }).setText(suggestion.replace(/:/g, ''))
    outer.createDiv({ cls: 'ES-emoji' }).setText(emoji[suggestion])
  }

  selectSuggestion (suggestion: string): void {
    if (this.context != null) {
      (this.context.editor).replaceRange(this.plugin.settings.immediateReplace ? emoji[suggestion] : `${suggestion} `, this.context.start, this.context.end)
    }
  }
}
