import { MarkdownPostProcessor } from 'obsidian'
import { emoji } from './emoji-list'

export const emojiProcessor: MarkdownPostProcessor = (el: HTMLElement) => {
  el.innerText.match(/[:][^\s:][^ \n:]*[:]/g)?.forEach((e: keyof typeof emoji) => emojiReplace(e, el))
}

function emojiReplace (shortcode: keyof typeof emoji, el: HTMLElement): any {
  if ((typeof el.tagName === 'string') && (el.tagName.includes('CODE') || el.tagName.includes('MJX'))) {
    return false
  }
  if (el.hasChildNodes()) {
    el.childNodes.forEach((child: ChildNode) => emojiReplace(shortcode, child as HTMLElement))
  } else {
    if (el.textContent !== null) { el.textContent = el.textContent.replace(shortcode as string, emoji[shortcode] ?? shortcode) }
  }
}
