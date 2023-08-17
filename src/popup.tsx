import {useEffect, useState} from "react"
import {useImmer} from "use-immer";
import './popup.css'

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
        sendMessageToContentScript({cmd: 'getClinicInfo', value: '你好，我是popup！'}, function (response: any) {
            const clinicInfo = JSON.parse(response);
            console.log(clinicInfo);
            setCurrentInfo(draft => {
                draft.chain.id = clinicInfo.value.chain.id;
                draft.chain.shortId = clinicInfo.value.chain.shortId;
                draft.chain.name = clinicInfo.value.chain.name;
                draft.clinic.id = clinicInfo.value.clinicId;
                draft.clinic.shortId = clinicInfo.value.shortId;
                draft.clinic.name = clinicInfo.value.clinicName;
            })
        });
    }

    useEffect(() => {
        getCurrentClinicInfo();
    })

    return (
        <div
            style={{
                // display: "flex",
                flexDirection: "column",
                padding: 16
            }}>
            <div>
                <div>
                    <span>chainId:</span>
                    <span className="selectable">{currentInfo.chain.id}</span>
                </div>
                <div>
                    <span>chainShortId:</span>
                    <span className="selectable">{currentInfo.chain.shortId}</span>
                </div>
                <div>
                    <span>chainName:</span>
                    <span className="selectable">{currentInfo.chain.name}</span>
                </div>
                <div>
                    <span>clinicId:</span>
                    <span className="selectable">{currentInfo.clinic.id}</span>
                </div>
                <div>
                    <span>clinicShortId:</span>
                    <span className="selectable">{currentInfo.clinic.shortId}</span>
                </div>
                <div>
                    <span>clinicName:</span>
                    <span className="selectable">{currentInfo.clinic.name}</span>
                </div>
                <div>
                    <span>employeeId:</span>
                    <span className="selectable">{currentInfo.employee.id}</span>
                </div>
                <div>
                    <span>employeeShortId:</span>
                    <span className="selectable">{currentInfo.employee.shortId}</span>
                </div>
                <div>
                    <span>employeeName:</span>
                    <span className="selectable">{currentInfo.employee.name}</span>
                </div>

            </div>
        </div>
    )
}

export default IndexPopup
