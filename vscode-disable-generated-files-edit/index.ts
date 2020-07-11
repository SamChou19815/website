import * as vscode from 'vscode';

const disabledEditDecorationType = vscode.window.createTextEditorDecorationType({
  isWholeLine: true,
  cursor: 'not-allowed',
  rangeBehavior: vscode.DecorationRangeBehavior.OpenOpen,
  overviewRulerLane: vscode.OverviewRulerLane.Full,
  overviewRulerColor: new vscode.ThemeColor('widget.shadow'),
  backgroundColor: 'rgba(255, 255, 0, 0.2)',
});

const updateGeneratedHoverForEditor = (editor: vscode.TextEditor | undefined): void => {
  if (editor == null) {
    return;
  }
  if (editor.document.getText().includes('@generated')) {
    editor.setDecorations(disabledEditDecorationType, [
      {
        range: new vscode.Range(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
        hoverMessage: 'Do not edit generated code or risk failing CI jobs.',
      },
    ]);
  }
};

export function activate(): void {
  vscode.window.onDidChangeActiveTextEditor((editor) => updateGeneratedHoverForEditor(editor));
  updateGeneratedHoverForEditor(vscode.window.activeTextEditor);
}
