import * as vscode from "vscode";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    );

    // Use a nonce to only allow a specific script to be run.
    // const nonce = getNonce();

    return `<!DOCTYPE html>
  			<html lang="en">
  			<head>
  				<meta charset="UTF-8">
  				
  				<meta name="viewport" content="width=device-width, initial-scale=1.0">
  				<link href="${styleResetUri}" rel="stylesheet">
  				<link href="${styleVSCodeUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">
                <style>
                    body {
                        height: 100vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        align-content: center;
                    }
                </style>
                <style>
                    #snackbar {
                        visibility: hidden;
                        min-width: 250px;
                        margin-left: -125px;
                        /* background-color: #5300d8; */
                        color: #fff;
                        text-align: center;
                        border-radius: 6px;
                        padding: 16px;
                        position: fixed;
                        z-index: 1;
                        left: 50%;
                        bottom: 30px;
                        font-size: 17px;
                    }

                    #snackbar.show {
                        visibility: visible;
                        -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
                        animation: fadein 0.5s, fadeout 0.5s 2.5s;
                    }
                </style>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
                <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.slim.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
  			</head>
              <body>
                <script>
                    window.onload = () => {
                    var m4aBtn = document.getElementById("m4aBtn");
                    var wavBtn = document.getElementById("wavBtn");
                    var mp3Btn = document.getElementById("mp3Btn");
                    var flacBtn = document.getElementById("flacBtn");
            
                    var m4ainput = document.getElementById("fileInputm4a");
                    var wavinput = document.getElementById("fileInputwav");
                    var mp3input = document.getElementById("fileInputmp3");
                    var flacinput = document.getElementById("fileInputflac");
            
                    var m4aContainer = document.getElementById("m4aContainer");
                    var wavContainer = document.getElementById("wavContainer");
                    var mp3Container = document.getElementById("mp4Container");
                    var flacContainer = document.getElementById("flacContainer");
            
                    m4aBtn.addEventListener("click", () => {
                        const selectedFile = m4ainput.files[0];
            
                        const deleteChild = document.getElementById("divCm4a");
                        if (deleteChild) {
                        m4aContainer.removeChild(deleteChild);
                        }
            
                        const divCm4a = document.createElement("div");
                        divCm4a.id = "divCm4a";
                        divCm4a.style.display = "flex";
                        divCm4a.style.flexDirection = "column";
                        divCm4a.style.justifyContent = "center";
                        divCm4a.style.alignItems = "center";
            
                        if (selectedFile) {
                        const reader = new FileReader();
            
                        reader.onload = (fileEvent) => {
                            const audioDataUrl = fileEvent.target.result;
                            const b4 = audioDataUrl.split(",")[1];
                            const getp = createP(b4);
                            divCm4a.appendChild(getp);
                            if (getp) {
                            navigator.clipboard.writeText(b4);
                            snackBar("Copied", "green");
                            const copyBtn = createButton();
                            divCm4a.appendChild(copyBtn);
                            copyBtn.addEventListener("click", () => {
                                navigator.clipboard.writeText(b4);
                                snackBar("Copied", "green");
                            });
                            }
                        };
                        m4aContainer.appendChild(divCm4a);
                        reader.readAsDataURL(selectedFile);
                        } else {
                        snackBar("Choose File !", "warning");
                        }
                    });
            
                    wavBtn.addEventListener("click", () => {
                        const selectedFile = wavinput.files[0];
            
                        const deleteChild = document.getElementById("divCwav");
                        if (deleteChild) {
                        wavContainer.removeChild(deleteChild);
                        }
            
                        const divCwav = document.createElement("div");
                        divCwav.id = "divCwav";
                        divCwav.style.display = "flex";
                        divCwav.style.flexDirection = "column";
                        divCwav.style.justifyContent = "center";
                        divCwav.style.alignItems = "center";
            
                        if (selectedFile) {
                        const reader = new FileReader();
            
                        reader.onload = (fileEvent) => {
                            const audioDataUrl = fileEvent.target.result;
                            const b4 = audioDataUrl.split(",")[1];
                            const getp = createP(b4);
                            divCwav.appendChild(getp);
                            if (getp) {
                            navigator.clipboard.writeText(b4);
                            snackBar("Copied", "green");
                            const copyBtn = createButton();
                            divCwav.appendChild(copyBtn);
                            copyBtn.addEventListener("click", () => {
                                navigator.clipboard.writeText(b4);
                                snackBar("Copied", "green");
                            });
                            }
                        };
                        wavContainer.appendChild(divCwav);
                        reader.readAsDataURL(selectedFile);
                        } else {
                        snackBar("Choose File !", "warning");
                        }
                    });
            
                    mp3Btn.addEventListener("click", () => {
                        const selectedFile = mp3input.files[0];
            
                        const deleteChild = document.getElementById("divCmp3");
                        if (deleteChild) {
                        mp3Container.removeChild(deleteChild);
                        }
            
                        const divCmp3 = document.createElement("div");
                        divCmp3.id = "divCmp3";
                        divCmp3.style.display = "flex";
                        divCmp3.style.flexDirection = "column";
                        divCmp3.style.justifyContent = "center";
                        divCmp3.style.alignItems = "center";
            
                        if (selectedFile) {
                        const reader = new FileReader();
            
                        reader.onload = (fileEvent) => {
                            const audioDataUrl = fileEvent.target.result;
                            const b4 = audioDataUrl.split(",")[1];
                            const getp = createP(b4);
                            divCmp3.appendChild(getp);
                            if (getp) {
                            navigator.clipboard.writeText(b4);
                            snackBar("Copied", "green");
                            const copyBtn = createButton();
                            divCmp3.appendChild(copyBtn);
                            copyBtn.addEventListener("click", () => {
                                navigator.clipboard.writeText(b4);
                                snackBar("Copied", "green");
                            });
                            }
                        };
                        mp3Container.appendChild(divCmp3);
                        reader.readAsDataURL(selectedFile);
                        } else {
                        snackBar("Choose File !", "warning");
                        }
                    });
            
                    flacBtn.addEventListener("click", () => {
                        const selectedFile = flacinput.files[0];
            
                        const deleteChild = document.getElementById("divCflac");
                        if (deleteChild) {
                        flacContainer.removeChild(deleteChild);
                        }
            
                        const divCflac = document.createElement("div");
                        divCflac.id = "divCflac";
                        divCflac.style.display = "flex";
                        divCflac.style.flexDirection = "column";
                        divCflac.style.justifyContent = "center";
                        divCflac.style.alignItems = "center";
            
                        if (selectedFile) {
                        const reader = new FileReader();
            
                        reader.onload = (fileEvent) => {
                            const audioDataUrl = fileEvent.target.result;
                            const b4 = audioDataUrl.split(",")[1];
                            const getp = createP(b4);
                            divCflac.appendChild(getp);
                            if (getp) {
                            navigator.clipboard.writeText(b4);
                            snackBar("Copied", "green");
                            const copyBtn = createButton();
                            divCflac.appendChild(copyBtn);
                            copyBtn.addEventListener("click", () => {
                                navigator.clipboard.writeText(b4);
                                snackBar("Copied", "green");
                            });
                            }
                        };
                        flacContainer.appendChild(divCflac);
                        reader.readAsDataURL(selectedFile);
                        } else {
                        snackBar("Choose File !", "warning");
                        }
                    });
            
                    function snackBar(text, type) {
                        var x = document.getElementById("snackbar");
                        x.innerHTML = text;
                        x.className = "show";
                        if (type == "warning") {
                        x.style.backgroundColor = "orange";
                        } else {
                        x.style.backgroundColor = "green";
                        }
            
                        setTimeout(function () {
                        x.className = x.className.replace("show", "");
                        }, 3000);
                    }
                    function createP(value) {
                        var myinput = document.createElement("p");
                        myinput.innerHTML = value.slice(0, 40) + " ...";
                        myinput.style.marginTop = "30px";
            
                        return myinput;
                    }
            
                    function createButton() {
                        const ButtonNew = document.createElement("button");
                        ButtonNew.innerText = "Copy";
                        ButtonNew.style.backgroundColor = "green";
                        ButtonNew.style.height = "35px";
                        ButtonNew.style.width = "60px";
                        ButtonNew.style.border = "none";
                        ButtonNew.style.borderRadius = "5px";
                        ButtonNew.style.color = "white";
                        return ButtonNew;
                    }
                    };
                </script>
            
                <img
                    src="https://icons8.com/vue-static/landings/animated-icons/icons/sound/sound_200.gif"
                    alt=""
                    style="width: 60px; height: 60px; margin-bottom: 30px"
                />
            
                <p
                    style="
                    font-size: 20px;
                    font-weight: 500;
                    margin-bottom: 30px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    "
                >
                    Select the type of voice you want to translate
                </p>
                <button
                    type="button"
                    class="btn btn-primary"
                    data-toggle="collapse"
                    data-target="#m4a"
                    style="
                    width: 200px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    "
                >
                    M4A to Base64
                </button>
                <div id="m4a" class="collapse">
                    <div
                    style="
                        margin-top: 30px;
                        margin-bottom: 30px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        align-content: center;
                    "
                    id="m4aContainer"
                    >
                    <div style="border: 0.5px solid black; padding: 10px">
                        <input
                        type="file"
                        id="fileInputm4a"
                        accept=".m4a"
                        style="width: 200px"
                        />
                    </div>
                    <button
                        style="
                        margin-top: 30px;
                        border: none;
                        background-color: rgb(9, 22, 95);
                        width: 170px;
                        height: 40px;
                        color: white;
                        border-radius: 4px;
                        "
                        id="m4aBtn"
                    >
                        convert
                    </button>
                    <div id="m4aTextAndBtn"></div>
                    </div>
                </div>
            
                <button
                    type="button"
                    class="btn btn-primary"
                    data-toggle="collapse"
                    data-target="#wav"
                    style="
                    width: 200px;
                    margin-top: 10px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    "
                >
                    WAV to Base64
                </button>
                <div id="wav" class="collapse">
                    <div
                    style="
                        margin-top: 30px;
                        margin-bottom: 30px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        align-content: center;
                    "
                    id="wavContainer"
                    >
                    <div style="border: 0.5px solid black; padding: 10px">
                        <input
                        type="file"
                        id="fileInputwav"
                        accept=".wav"
                        style="width: 200px"
                        />
                    </div>
                    <button
                        style="
                        margin-top: 30px;
                        border: none;
                        background-color: rgb(9, 22, 95);
                        width: 170px;
                        height: 40px;
                        color: white;
                        border-radius: 4px;
                        "
                        id="wavBtn"
                    >
                        convert
                    </button>
                    </div>
                </div>
            
                <button
                    type="button"
                    class="btn btn-primary"
                    data-toggle="collapse"
                    data-target="#mp3"
                    style="
                    width: 200px;
                    margin-top: 10px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    "
                >
                    MP3 to Base64
                </button>
                <div id="mp3" class="collapse">
                    <div
                    style="
                        margin-top: 30px;
                        margin-bottom: 30px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        align-content: center;
                    "
                    id="mp4Container"
                    >
                    <div style="border: 0.5px solid black; padding: 10px">
                        <input
                        type="file"
                        id="fileInputmp3"
                        accept=".mp3"
                        style="width: 200px"
                        />
                    </div>
                    <button
                        style="
                        margin-top: 30px;
                        border: none;
                        background-color: rgb(9, 22, 95);
                        width: 170px;
                        height: 40px;
                        color: white;
                        border-radius: 4px;
                        "
                        id="mp3Btn"
                    >
                        convert
                    </button>
                    </div>
                </div>
            
                <button
                    type="button"
                    class="btn btn-primary"
                    data-toggle="collapse"
                    data-target="#flac"
                    style="
                    width: 200px;
                    margin-top: 10px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    "
                >
                    FLAC to Base64
                </button>
                <div id="flac" class="collapse">
                    <div
                    style="
                        margin-top: 30px;
                        margin-bottom: 30px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        align-content: center;
                    "
                    id="flacContainer"
                    >
                    <div style="border: 0.5px solid black; padding: 10px">
                        <input
                        type="file"
                        id="fileInputflac"
                        accept=".flac"
                        style="width: 200px"
                        />
                    </div>
                    <button
                        style="
                        margin-top: 30px;
                        border: none;
                        background-color: rgb(9, 22, 95);
                        width: 170px;
                        height: 40px;
                        color: white;
                        border-radius: 4px;
                        "
                        id="flacBtn"
                    >
                        convert
                    </button>
                    </div>
                </div>
            
                <div id="snackbar"></div>
                </body>
  			</html>`;
  }
}
