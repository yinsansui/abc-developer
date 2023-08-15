import {useEffect, useState} from "react"


function IndexPopup() {
    const [chainId, setChainId] = useState('');
    const [chainShortId, setChainShortId] = useState('');
    const [chainName, setChainName] = useState('');
    const [clinicId, setClinicId] = useState('');
    const [clinicShortId, setClinicShortId] = useState('');
    const [clinicName, setClinicName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [employeeShortId, setEmployeeShortId] = useState('');
    const [employeeName, setEmployeeName] = useState('');

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
            setChainId(clinicInfo.value.chain.id);
            setChainShortId(clinicInfo.value.chain.shortId);
            setChainName(clinicInfo.value.chain.name);
            setClinicId(clinicInfo.value.clinicId);
            setClinicShortId(clinicInfo.value.shortId);
            setClinicName(clinicInfo.value.clinicName);
        });
    }

    useEffect(() => {
        getCurrentClinicInfo();
    })

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: 16
            }}>
            <div>
                <div>
                    <span>chainId:</span>
                    <span>{chainId}</span>
                </div>
                <div>
                    <span>chainShortId:</span>
                    <span>{chainShortId}</span>
                </div>
                <div>
                    <span>chainName:</span>
                    <span>{chainName}</span>
                </div>
                <div>
                    <span>clinicId:</span>
                    <span>{clinicId}</span>
                </div>
                <div>
                    <span>clinicShortId:</span>
                    <span>{clinicShortId}</span>
                </div>
                <div>
                    <span>clinicName:</span>
                    <span>{clinicName}</span>
                </div>
                <div>
                    <span>employeeId:</span>
                    <span>{employeeId}</span>
                </div>
                <div>
                    <span>employeeShortId:</span>
                    <span>{employeeShortId}</span>
                </div>
                <div>
                    <span>employeeName:</span>
                    <span>{employeeName}</span>
                </div>

            </div>
        </div>
    )
}

export default IndexPopup
