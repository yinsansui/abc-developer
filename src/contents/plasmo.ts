import type {PlasmoCSConfig} from "plasmo"
import type {Command} from "~popup";

export const config: PlasmoCSConfig = {
    matches: ["https://*/*"]
}

export interface ExpireObjHolder<T> {
    value: T;
    expires: number;
    time: number;
}

export interface CurrentClinicInfo {
    chainName: string;
    hisType: number;
    id: string;
    name: string;
    shortName: string;
    chain: Chain;
    shortId: string;
    chainId: string;
    clinicId: string;
    clinicName: string;
}

export interface Chain {
    id: string;
    shortId: string;
    name: string;
    shortName: string;
}

export interface CurrentEmployeeInfo {
    employeeId: string;
    employeeShortId: string;
    employeeName: string;
}

chrome.runtime.onMessage.addListener((command: Command, sender, sendResponse: any) => {
    if (command.cmd === 'getCurrentClinicInfo') {
        const currentClinicInfoStr = window.localStorage.getItem('_current_clinic_');
        const expireObjHolder: ExpireObjHolder<CurrentClinicInfo> = JSON.parse(currentClinicInfoStr)
        sendResponse(expireObjHolder.value);
    } else if (command.cmd === 'getCurrentEmployeeInfo') {
        // 解析cookie，从中获取 key 为 _global_token_ 的 value
        const cookieStr = document.cookie;
        const cookieArr = cookieStr.split(';');
        const cookieMap = new Map<string, string>();
        cookieArr.forEach((cookie) => {
            const [key, value] = cookie.split('=');
            cookieMap.set(key.trim(), value.trim());
        });
        const jwtToken = cookieMap.get('_global_token_');
        if (!jwtToken) {
            sendResponse(null);
        }
        const currentEmployeeInfo: CurrentEmployeeInfo = decodeJwt(jwtToken);
        sendResponse(currentEmployeeInfo);
    }
});

function decodeJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}


export {}