import {useEffect, useState} from "react"
import {useImmer} from "use-immer";
import './popup.css'
import type {CurrentClinicInfo, CurrentEmployeeInfo} from "~contents/plasmo";

interface OrganInfo {
    id: string
    shortId: string
    name: string
}

interface EmployeeInfo {
    id: string
    shortId: string
    name: string
}

interface CurrentInfo {
    chain: OrganInfo
    clinic: OrganInfo
    employee: EmployeeInfo
}

export interface Command {
    cmd: string
}

function IndexPopup() {
    const [currentInfo, setCurrentInfo] = useImmer<CurrentInfo>({
        chain: {
            id: '',
            shortId: '',
            name: ''
        }, clinic: {
            id: '',
            shortId: '',
            name: ''
        }, employee: {
            id: '',
            shortId: '',
            name: ''
        }
    })

    function sendMessageToContentScript(message, callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
                if (callback) callback(response);
            });
        });
    }

    function getCurrentClinicInfo(): void {
        const command: Command = {cmd: 'getCurrentClinicInfo'}
        sendMessageToContentScript(command, function (clinicInfo: CurrentClinicInfo) {
            if (!clinicInfo) {
                return;
            }

            setCurrentInfo(draft => {
                // 连锁信息
                draft.chain.id = clinicInfo.chain.id;
                draft.chain.shortId = clinicInfo.chain.shortId;
                draft.chain.name = clinicInfo.chain.name;

                // 门店信息
                draft.clinic.id = clinicInfo.clinicId;
                draft.clinic.shortId = clinicInfo.shortId;
                draft.clinic.name = clinicInfo.clinicName;
            })
        });
    }

    function getCurrentEmployeeInfo(): void {
        const command: Command = {cmd: "getCurrentEmployeeInfo"}
        sendMessageToContentScript(command, function (currentEmployeeInfo: CurrentEmployeeInfo) {
            if (!currentEmployeeInfo) {
                return;
            }

            setCurrentInfo((draft: CurrentInfo) => {
                // 连锁信息
                draft.employee.id = currentEmployeeInfo.employeeId;
                draft.employee.shortId = currentEmployeeInfo.employeeShortId;
                draft.employee.name = currentEmployeeInfo.employeeName;
            })
        });
    }

    useEffect(() => {
        getCurrentClinicInfo();
        getCurrentEmployeeInfo();
    })

    return (
        <div
            style={{
                // display: "flex",
                flexDirection: "column",
                padding: 8,
                width: '280px'
            }}>
            <div>
                <div className="row">
                    <span>连锁ID:</span>
                    <span className="selectable">{currentInfo.chain.id}</span>
                </div>
                <div className="row">
                    <span>连锁短ID:</span>
                    <span className="selectable">{currentInfo.chain.shortId}</span>
                </div>
                <div className="row">
                    <span>连锁名称:</span>
                    <span className="selectable">{currentInfo.chain.name}</span>
                </div>
                <div className="row">
                    <span>门店ID:</span>
                    <span className="selectable">{currentInfo.clinic.id}</span>
                </div>
                <div className="row">
                    <span>门店短ID:</span>
                    <span className="selectable">{currentInfo.clinic.shortId}</span>
                </div>
                <div className="row">
                    <span>门店名称:</span>
                    <span className="selectable">{currentInfo.clinic.name}</span>
                </div>
                <div className="row">
                    <span>员工ID:</span>
                    <span className="selectable">{currentInfo.employee.id}</span>
                </div>
                <div className="row">
                    <span>员工短ID:</span>
                    <span className="selectable">{currentInfo.employee.shortId}</span>
                </div>
                <div className="row">
                    <span>员工名称:</span>
                    <span className="selectable">{currentInfo.employee.name}</span>
                </div>

            </div>
        </div>
    )
}

export default IndexPopup
