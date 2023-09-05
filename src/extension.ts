// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import init, {parse_json_default} from './wasm/rust_json_lib_rs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rustjson" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('rustjson.Rust2Json', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from RustJson!');


		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const selection = editor.selection;
		const selectedCode = editor.document.getText(selection);

		// Process selected code
		// if (!isJsonString(selectedCode)) {
		// 	return;
		// }
		// console.log(selectedCode);
		vscode.window.showInformationMessage(selectedCode);

		let webviewPanel = vscode.window.createWebviewPanel('RustJson', 'RustJson', vscode.ViewColumn.One, {
			enableScripts: true
		});
		 // 在panel中加载并显示自定义窗口的HTML文件
		// webviewPanel.webview.html = await getWebviewContent();
		let json = {
            "name": "zhangsan",
            "sex": false,
            "city": {
                "country": "beijing"
            },
            "age": 1
        }
		//webviewPanel.webview.html = '<h1>RustJson</h1>';
		webviewPanel.webview.html = '<h1>' + parse_json_default(JSON.stringify(json)) +'</h1>';

		const quickPick = vscode.window.createQuickPick();
		quickPick.items = [
			{ label: '1', description: '1' },
			{ label: '2', description: '2' },
			{ label: '3', description: '3' }
		]
		quickPick.onDidChangeSelection((selection) => {
			vscode.window.showInformationMessage(selection[0].description ?? "");
		});
		quickPick.show();


		// 输入
		// const input = vscode.window.createInputBox();
		// input.title = "RustJson";
		// input.prompt = "Please input your Json";
		// input.show();

		// if (editor) {
		// 	const line = 0; // 设置要选中的代码的起始行号
		// 	const startCharacter = 0; // 设置要选中的代码的起始字符位置
		// 	const endCharacter = 10; // 设置要选中的代码的结束字符位置

		// 	const startPosition = new vscode.Position(line, startCharacter);
		// 	const endPosition = new vscode.Position(line, endCharacter);
		// 	const selectionRange = new vscode.Range(startPosition, endPosition);

		// 	editor.selection = new vscode.Selection(selectionRange.start, selectionRange.end);
		// }

		/**
		 * Judge the code you select is legal json
		 * 
		 * @param code the code you select
		 * @returns is legal json string
		 */
		function isJsonString(code: string): boolean {
			try {
				JSON.parse(code);
			} catch (error) {
				vscode.window.showInformationMessage("Please select json");
				return false;
			}
			return true;
		}

		// function getWebviewContent() {
		// 	const htmlPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'customView', 'customView.html'));
		// 	const htmlContent = fs.readFileSync(htmlPath.with({ scheme: 'vscode-resource' }).toString());
		// 	return htmlContent.toString();
		// }
	});


	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
