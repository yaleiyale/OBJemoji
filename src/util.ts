export function checkForInputBlock (
  cmEditor: CodeMirror.Editor,
  cursorPos: CodeMirror.Position
): boolean {
  const tokenType = cmEditor.getTokenAt(cursorPos, true).type
  return (typeof (tokenType) !== 'string') || (!tokenType.includes('code') && !tokenType.includes('math')) // "code" matches "inline-code" or "codeblock"
}
