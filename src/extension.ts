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
	// let webviewPanel: vscode.WebviewPanel | undefined = undefined;

	// let formatJsonResult = "";

	context.subscriptions.push(
		// The command has been defined in the package.json file
		// Now provide the implementation of the command with registerCommand
		// The commandId parameter must match the command field in package.json
		vscode.commands.registerCommand('rustjson.Rust2Json', async () => {

			let webviewPanel = vscode.window.createWebviewPanel('RustJson', 'RustJson', vscode.ViewColumn.One, {
				enableScripts: true,
			});
			let json = {
				"name": "zhangsan",
				"sex": false,
				"city": {
					"country": "beijing"
				},
				"age": 1
			}
			// let htmlPath = vscode.Uri.file(path.join(context.extensionPath, 'static', 'ui.html'));
			let htmlUri = vscode.Uri.joinPath(context.extensionUri, "static", 'ui.html');
			console.log(htmlUri.fsPath);

			// aceSrc
			let aceUri = vscode.Uri.joinPath(context.extensionUri, "static", "ace", 'ace.js');
			let aceSrc = webviewPanel.webview.asWebviewUri(aceUri);
			console.log(aceSrc.toString());

			// aceThemeMonokai
			let aceThemeMonokaiUri = vscode.Uri.joinPath(context.extensionUri, "static", "ace", 'theme-monokai.js');
			let aceThemeMonokai = webviewPanel.webview.asWebviewUri(aceThemeMonokaiUri);
			console.log(aceThemeMonokai.toString());

			let html = readFileSync(htmlUri.fsPath, "utf-8");
			webviewPanel.webview.html = html.toString()
				.replace("{{aceSrc}}", aceSrc.toString())
				.replace("{{aceThemeMonokai}}", aceThemeMonokai.toString());
			// console.log(htmlUri);

			webviewPanel.webview.onDidReceiveMessage(
				message => {
					switch (message.command) {
						case 'ok':
							console.log("ok button clicked: " + message.text);
							if (isJsonString(message.text)) {
								let result = wasm.parse_json_default(message.text);
								console.log(result);
								webviewPanel.webview.postMessage({ command: 'json', text: result });
							} else {
								vscode.window.showInformationMessage('Error: Invalid JSON format.');
							}
							return;
					}
				},
				undefined,
				context.subscriptions
			);

			function isJsonString(str: string) {
				try {
					JSON.parse(str);
				} catch (e) {
					return false;
				}
				return true;
			}
		})
	);

	// Send a message to the webview
	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('catCoding.doRefactor', () => {
	// 		if (!webviewPanel) {
	// 			return;
	// 		}

	// 		webviewPanel.webview.postMessage({ command: 'refactor' });
	// 	})
	// );
}


// This method is called when your extension is deactivated
export function deactivate() { }
