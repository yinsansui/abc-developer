import type {AppConfig} from "~options";
import DisplayTipComponent from "~background/plasmo1";
import type {Command} from "~popup";

const defaultAppConfig: AppConfig = {
    keymapConfig: {
        displayTipShortCat: "ctrl+k",
    },
    displayConfig: {
        displayShortId: true,
        displayFormInfo: true
    }
}

let appConfig: AppConfig = defaultAppConfig;

function loadAppConfig() {
    chrome.storage.local.get().then(value => {
        if (!value.appConfig) {
            return;
        }
        console.log("load local appConfig", value.appConfig)
        appConfig = value.appConfig;
    });
}

loadAppConfig();

const inject = async (tabId: number) => {
    chrome.scripting.executeScript(
        {
            target: {
                tabId
            },
            world: "MAIN",
            func: DisplayTipComponent,
            args: [appConfig],
        },
        () => {
            console.log("Background script got callback after injection")
        }
    )

}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    inject(tabId)
})

chrome.runtime.onMessage.addListener(function (request: Command, sender, sendResponse) {
    if (request.cmd === "updateAppConfig") {
        updateAppConfig(request.data);
    }
});

export function updateAppConfig(newAppConfig: AppConfig) {
    console.log("updateAppConfig index", newAppConfig)
    appConfig = newAppConfig;
    chrome.storage.local.set({
        "appConfig": appConfig
    }, function () {
        console.log("updateAppConfig success")
    })
    // localStorage.setItem("appConfig", JSON.stringify(appConfig));
}

export {}