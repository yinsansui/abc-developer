import type {PlasmoCSConfig} from "plasmo"
import type {Command} from "~popup";

export const config: PlasmoCSConfig = {
    matches: ["https://*/*"],
    world: "MAIN"
}

function displayPatientInfo() {
    const patientSectionWrapperEleColl = document.getElementsByClassName('patient-section-wrapper');
    if (patientSectionWrapperEleColl.length == 0) {
        return;
    }

    for (let patientSectionWrapperEle of patientSectionWrapperEleColl) {
        addTooltip(patientSectionWrapperEle, patientSectionWrapperEle.__vue__._props.value.id)
        // console.log(patientSectionWrapperEle.__vue__._props.value.id)
    }
}

// 添加小框函数
function addTooltip(targetElement, content) {
    const id = 'tooltip-' + content
    // 检查是否已存在 tooltip 元素
    let tooltip = document.getElementById(id);
    if (!tooltip) {
        // 创建并添加 tooltip 元素
        tooltip = document.createElement('div');
        tooltip.id = id;
        tooltip.className = 'tooltip';
        tooltip.style.display = 'none';
        document.body.appendChild(tooltip);
    }
    console.log(tooltip);

    // 计算目标元素位置
    const rect = targetElement.getBoundingClientRect();
    const topOffset = rect.top - 40; // 调整小框距离目标元素的距离

    // 设置小框的位置和内容
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${topOffset}px`;
    tooltip.innerHTML = content;

    // 显示小框
    tooltip.style.display = 'block';
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
        console.log('ffdsfaw')
        // 显示患者信息
        displayPatientInfo()
    }
});
export {}