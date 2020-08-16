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
  if (editor.document.getText().includes('@' + 'generated')) {
    editor.setDecorations(disabledEditDecorationType, [
      {
        range: new vscode.Range(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
        hoverMessage: 'Do not edit generated code or risk failing CI jobs.',
      },
    ]);
  } else {
    editor.setDecorations(disabledEditDecorationType, []);
  }
};

// eslint-disable-next-line import/prefer-default-export
export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => updateGeneratedHoverForEditor(editor)),
    vscode.workspace.onDidChangeTextDocument(({ document }) => {
      const { activeTextEditor } = vscode.window;
      if (
        activeTextEditor != null &&
        activeTextEditor.document.uri.toString() === document.uri.toString()
      ) {
        updateGeneratedHoverForEditor(activeTextEditor);
      }
    })
  );

  updateGeneratedHoverForEditor(vscode.window.activeTextEditor);
}
