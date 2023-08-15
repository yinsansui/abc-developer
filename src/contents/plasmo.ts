import type {PlasmoCSConfig} from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["https://*/*"]
}

chrome.runtime.onMessage.addListener((request: any, sender, sendResponse: any) => {
    const currentClinicInfo = window.localStorage.getItem('_current_clinic_');
    sendResponse(currentClinicInfo);
});

export {}