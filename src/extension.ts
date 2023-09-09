// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import * as wasm_module from './wasm/rust_json_lib_rs';
// import * as wasm from './wasm/rust_json_lib_rs_bg.wasm';
import * as wasm from '../pkg';
import path = require('path');
import { readFileSync } from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		// The command has been defined in the package.json file
		// Now provide the implementation of the command with registerCommand
		// The commandId parameter must match the command field in package.json
		vscode.commands.registerCommand('rustjson.Rust2Json', async () => {

			// Use the console to output diagnostic information (console.log) and errors (console.error)
			// This line of code will only be executed once when your extension is activated
			// console.log('Congratulations, your extension "rustjson" is now active!');
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			// vscode.window.showInformationMessage('Hello World from RustJson!');

			// https://code.visualstudio.com/api/extension-guides/webview

			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}

			// const selection = editor.selection;
			// const selectedCode = editor.document.getText(selection);

			// Process selected code
			// if (!isJsonString(selectedCode)) {
			// 	return;
			// }
			// console.log(selectedCode);
			// vscode.window.showInformationMessage(selectedCode);

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
			// 加载本地html
			// webviewPanel.webview.html = fs.readFileSync(path.join(context.extensionPath, 'src', 'customView', 'customView.html'), 'utf-8');
			// webviewPanel.webview.html = '<h1>' + wasm.parse_json_default(JSON.stringify(json)) + '</h1>';
			let htmlPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'ui.html'));
			let html = readFileSync(htmlPath.fsPath);
			webviewPanel.webview.html = html.toString();

			webviewPanel.webview.onDidReceiveMessage(
				message => {
					switch (message.command) {
						case 'ok':
							console.log("ok button clicked: " + message.text);
							vscode.window.showInformationMessage("ok button clicked: " + message.text);
							return;
					}
				},
				undefined,
				context.subscriptions
			);
		})
	);
	//context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
