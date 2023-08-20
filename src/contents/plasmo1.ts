import type {PlasmoCSConfig} from "plasmo"
import type {Command} from "~popup";

export const config: PlasmoCSConfig = {
    matches: ["https://*/*"],
    world: "MAIN"
}

function displayQuickList() {
    const quickListItemWrapperEleColl = document.getElementsByClassName('quick-list-item-wrapper');
    if (quickListItemWrapperEleColl.length == 0) {
        return;
    }

    for (let quickListItemWrapperEle of quickListItemWrapperEleColl) {
        addTooltip(quickListItemWrapperEle, quickListItemWrapperEle.__vue__._props.quickItem.id)
    }
}

function displayDispensing() {
    const dispensingFormEleColl = document.getElementsByClassName('abc-charge-table')[0].__vue__._props.dispensingForm
    if (dispensingFormEleColl.length == 0) {
        return;
    }

    for (let dispensingFormEle of dispensingFormEleColl) {

        // 处方ID
        addTooltip(dispensingFormEle, dispensingFormEle.id)
        // 药品列表
        const dragEleColl = dispensingFormEle.getElementsByClassName('table-tr')
        if (dragEleColl.length > 0) {
            for (let dragEle of dragEleColl) {
                addTooltip(dragEle, dragEle.getAttribute('data-id'));
            }
        }
    }
}

function displayOutpatient() {
    // 处方列表
    const prescriptionTableWrapperEleColl = document.getElementsByClassName('prescription-table-wrapper');
    if (prescriptionTableWrapperEleColl.length == 0) {
        return;
    }

    for (let prescriptionTableWrapperEle of prescriptionTableWrapperEleColl) {
        // 处方ID
        addTooltip(prescriptionTableWrapperEle, prescriptionTableWrapperEle.__vue__._props.form.id)
        // // 药品列表
        const dragEleColl = prescriptionTableWrapperEle.getElementsByClassName('table-tr')
        if (dragEleColl.length > 0) {
            for (let dragEle of dragEleColl) {
                addTooltip(dragEle, dragEle.getAttribute('data-id'));
            }
        }
    }
}

function displayPatientInfo() {
    const patientSectionWrapperEleColl = document.getElementsByClassName('patient-section-wrapper');
    if (patientSectionWrapperEleColl.length == 0) {
        return;
    }

    for (let patientSectionWrapperEle of patientSectionWrapperEleColl) {
        addTooltip(patientSectionWrapperEle, patientSectionWrapperEle.__vue__._props.value.id)
    }
}

// 添加小框函数
function addTooltip(targetElement, content) {
    console.log(targetElement);
    const id = 'tooltip-' + content
    // 检查是否已存在 tooltip 元素
    let tooltipNode = document.getElementById(id);
    if (!tooltipNode) {
        // 创建并添加 tooltip 元素
        tooltipNode = document.createElement('div');
        tooltipNode.id = id;
        tooltipNode.className = 'tooltip';
        tooltipNode.style.display = 'none';
        tooltipNode.style.position = 'fixed';
        tooltipNode.style.overflow = 'unset';
        tooltipNode.style['z-index'] = 999999;
        tooltipNode.style.backgroundColor = 'yellow';
        const tooltipTextNoe = document.createTextNode(content);
        tooltipNode.appendChild(tooltipTextNoe);
        document.body.appendChild(tooltipNode);
    }

    // 计算目标元素位置
    const rect = targetElement.getBoundingClientRect();
    const topOffset = rect.top - 5; // 调整小框距离目标元素的距离

    // 设置小框的位置和内容
    tooltipNode.style.left = `${rect.left}px`;
    tooltipNode.style.top = `${topOffset}px`;

    // 显示小框
    tooltipNode.style.display = 'block';
    console.log(tooltipNode);
}

// 移除小框函数
function removeTooltip() {
    // 隐藏所有 tooltip 元素
    const tooltips = document.getElementsByClassName('tooltip');
    for (let tooltip of tooltips) {
        tooltip.style.display = 'none';
    }
}

document.addEventListener('keydown', (event) => {
    // cmd + v
    if (event.metaKey && event.keyCode === 75) {
        // 显示患者信息
        displayPatientInfo();
        // 显示门诊处信息
        displayOutpatient();
        // 显示药房处信息
        // displayDispensing();
        // 显示 ql 中的信息
        displayQuickList()
    } else if (event.keyCode === 27) {
        // 移除所有的 tooltip 元素
        removeTooltip();
    }
});
export {}