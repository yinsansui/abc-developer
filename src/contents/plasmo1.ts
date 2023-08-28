import type {PlasmoCSConfig} from "plasmo"
import type {Command} from "~popup";

export const config: PlasmoCSConfig = {
    matches: ["https://*.abcyun.cn/*", "https://*.abczs.cn/*", "http://*.abczs.cn/*"],
    world: "MAIN"
}

class Tip {
    id: string;
    tipItems: TipItem[];

    constructor(id: string, tipItems: TipItem[]) {
        this.id = id;
        this.tipItems = tipItems;
    }

    public static of(id: string, prefix: string, content: string = id): Tip {
        const tipItems = new Array<TipItem>();
        tipItems.push(new TipItem(prefix, content));
        return new Tip(id, tipItems);
    }

    public addTipItem(tipItem: TipItem): Tip {
        this.tipItems.push(tipItem);
        return this;
    }
}

class TipItem {
    prefix: string;
    content: string;

    constructor(prefix: string, content: string) {
        this.prefix = prefix;
        this.content = content;
    }
}

interface Module {

    /**
     * 显示提示框
     */
    displayTip(): void;

    /**
     * 隐藏提示框
     */
    hiddenTip(): void;

}

abstract class AbstractModule implements Module {

    private display: Boolean = false;

    displayTip(): void {
        if (this.display) {
            return;
        }

        try {
            this.doDisplayTip();
        } catch (e) {
            console.log("display tip error", e)
        }

        this.display = true;
    }

    protected abstract doDisplayTip(): void;

    hiddenTip(): void {
        if (!this.display) {
            return;
        }

        hiddenTooltip();

        this.display = false;
    }

}

class TreatmentModule extends AbstractModule {

    protected doDisplayTip(): void {
        displayQuickList("收费单ID:");
        displayPatientBar();
        this.displayTreatmentForms();
    }

    private displayTreatmentForms() {
        // 处方列表
        const nurseTableWrapperEleColl = document.getElementsByClassName('nurse-table-wrapper');
        if (nurseTableWrapperEleColl.length == 0) {
            return;
        }

        for (let nurseTableWrapperEle of nurseTableWrapperEleColl) {
            // 处方ID
            try {
                addTooltip(nurseTableWrapperEle, Tip.of(nurseTableWrapperEle['__vue__']['_props']['productForms'][0]['id'], "formId:"));
            } catch (e) {
                console.log("add treatmentForm tooltip error", e)
            }
            // // // 药品列表
            // const dragEleColl = prescriptionTableWrapperEle.getElementsByClassName('table-tr')
            // if (dragEleColl.length > 0) {
            //     for (let dragEle of dragEleColl) {
            //         addTooltip(dragEle, dragEle.getAttribute('data-id'), "itemId:");
            //     }
            // }
        }
    }
}

class OutpatientModule extends AbstractModule {

    protected doDisplayTip(): void {
        displayQuickList("门诊单ID:");
        displayPatientBar();
        this.displayOutpatientForms();
    }

    private displayOutpatientForms() {
        // 处方列表
        const prescriptionTableWrapperEleColl = document.getElementsByClassName('prescription-table-wrapper');
        if (prescriptionTableWrapperEleColl.length == 0) {
            return;
        }

        for (let prescriptionTableWrapperEle of prescriptionTableWrapperEleColl) {
            // 处方ID
            addTooltip(prescriptionTableWrapperEle, Tip.of(prescriptionTableWrapperEle['__vue__']['_props']['form']['id'], "formId:"));
            // // 药品列表
            const dragEleColl = prescriptionTableWrapperEle.getElementsByClassName('table-tr')
            if (dragEleColl.length > 0) {
                for (let dragEle of dragEleColl) {
                    addTooltip(dragEle, Tip.of(dragEle.getAttribute('data-id'), "itemId:"));
                }
            }
        }
    }

}

class ChildHealthModule extends OutpatientModule {
}

class CashierModule extends AbstractModule {

    protected doDisplayTip(): void {
        displayQuickList("收费单ID:");
        displayPatientBar();
        this.displayChargeForms();
    }

    private displayChargeForms() {
        // 处方列表
        const prescriptionFormEleColl = document.getElementsByClassName('prescription-form');
        if (prescriptionFormEleColl.length == 0) {
            return;
        }

        for (let prescriptionFormEle of prescriptionFormEleColl) {
            // 药品列表
            const dragEleColl = prescriptionFormEle.getElementsByClassName('tr')
            if (dragEleColl.length > 0) {
                // 处方ID
                const formId = dragEleColl[0]['__vue__']['_props']['chargeForm']['id'];

                for (let i = 0; i < dragEleColl.length; i++) {
                    const dragEle = dragEleColl[i];
                    const itemId = dragEle['__vue__']['_props']['item']['id'];
                    let tip: Tip;
                    if (i == 0) {
                        tip = Tip.of(formId, "formId:");
                        tip.addTipItem(new TipItem("itemId:", itemId))
                    } else {
                        tip = Tip.of(itemId, "itemId:");
                    }
                    addTooltip(dragEle, tip);
                }
            }
        }
    }
}

class PharmacyModule extends AbstractModule {
    protected doDisplayTip(): void {
        displayQuickList("发药单ID:");
        displayPatientBar();
        this.displayDispensingForms();
    }

    private displayDispensingForms() {
        const dispensingFormEleColl = document.getElementsByClassName('abc-charge-table')
        if (dispensingFormEleColl.length == 0) {
            return;
        }

        for (let dispensingFormEle of dispensingFormEleColl) {
            console.log(dispensingFormEle);
            // 处方ID
            try {
                const formId = dispensingFormEle['__vue__']['_props']['form']['id'];
                addTooltip(dispensingFormEle, Tip.of(formId, "formId:"));
            } catch (e) {
                console.log("add dispensingForm tooltip error", e)
            }

            // 药品列表
            const dragEleColl = dispensingFormEle.getElementsByClassName('pharmacy')
            if (dragEleColl.length > 0) {
                for (let dragEle of dragEleColl) {
                    try {
                        addTooltip(dragEle, Tip.of(dragEle.getAttribute('data-id'), "itemId:"));
                    } catch (e) {
                        console.log("add dispensingForm item tooltip error", e)
                    }
                }
            }
        }
    }
}

class InspectRisModule extends AbstractModule {
    protected doDisplayTip(): void {
        displayQuickList("检查单ID:");
        displayPatientBar();
    }

}

class ExaminationModule extends AbstractModule {
    protected doDisplayTip(): void {
        displayQuickList("检验单ID:");
        displayPatientBar();
    }

}

class CrmPatientModule extends AbstractModule {
    protected doDisplayTip(): void {
        displayQuickList("患者ID:", 'item-patient', (ele) => ele['__vue__']['_props']['patient']['id']);
        displayPatientBar();
    }

}

function displayQuickList(prefix: string,
                          className: string = 'quick-list-item-wrapper',
                          idGetter: (ele: Element) => string = (ele) => ele['__vue__']['_props']['quickItem']['id']) {
    const quickListItemWrapperEleColl = document.getElementsByClassName(className);
    if (quickListItemWrapperEleColl.length == 0) {
        return;
    }

    for (let quickListItemWrapperEle of quickListItemWrapperEleColl) {
        addTooltip(quickListItemWrapperEle, Tip.of(idGetter(quickListItemWrapperEle), prefix));
    }
}

function displayPatientBar() {
    const patientSectionWrapperEleColl = document.getElementsByClassName('patient-section-wrapper');
    if (patientSectionWrapperEleColl.length == 0) {
        return;
    }

    for (let patientSectionWrapperEle of patientSectionWrapperEleColl) {
        const id = patientSectionWrapperEle['__vue__']['_props']['value']['id'];
        new Tip(id, new Array<TipItem>()).tipItems.push(new TipItem("患者ID:", id))
        addTooltip(patientSectionWrapperEle, Tip.of(patientSectionWrapperEle['__vue__']['_props']['value']['id'], "患者ID:"))
    }
}

// 添加小框函数
function addTooltip(targetElement, tip: Tip) {
    if (tip == null) {
        return;
    }

    const id = 'tooltip-' + tip.id
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
        tooltipNode.style['box-shadow'] = '0 2px 4px rgba(0, 0, 0, 0.1)';
        tooltipNode.style['padding'] = '0 6px';
        tooltipNode.style.borderRadius = '4px';
        tooltipNode.style.backgroundColor = '#f2ff26';
        tooltipNode.style.fontFamily = 'Helvetica, Tahoma, Arial'

        for (let i = 0; i < tip.tipItems.length; i++) {
            const tipItem = tip.tipItems[i];
            // tipItem.content 为空是不显示
            if (!tipItem.content) {
                return;
            }
            const tooltipTextNoe = document.createTextNode(tipItem.prefix + tipItem.content);
            if (i > 0) {
                tooltipNode.appendChild(document.createTextNode('    '));
            }
            tooltipNode.appendChild(tooltipTextNoe);
        }
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
}

// 移除小框函数
function hiddenTooltip() {
    // 隐藏所有 tooltip 元素
    const tooltips = document.getElementsByClassName('tooltip');
    for (let tooltip of tooltips) {
        tooltip.style.display = 'none';
    }
}

const pathToModule = new Map<string, Module>();
pathToModule.set('/treatment', new TreatmentModule());
pathToModule.set('/outpatient', new OutpatientModule());
pathToModule.set('/childhealth', new ChildHealthModule());
pathToModule.set('/cashier', new CashierModule());
pathToModule.set('/pharmacy', new PharmacyModule());
pathToModule.set('/inspect/ris', new InspectRisModule());
pathToModule.set('/examination', new ExaminationModule());
pathToModule.set('/crm/patient-files', new CrmPatientModule());

/**
 * 获取当前页面名称
 */
function getCurrentModule(): Module {
    const pathname = window.location.pathname;
    for (let [path, module] of pathToModule) {
        if (pathname.startsWith(path)) {
            return module;
        }
    }
    return null;
}

let latestModule: Module = null;

document.addEventListener('keydown', (event) => {
    // cmd + v
    if (event.metaKey && event.keyCode === 75) {
        const currentModule = getCurrentModule();
        if (!currentModule) {
            return;
        }

        currentModule.displayTip();

        latestModule = currentModule;
        // // 显示患者栏信息
        // displayPatientBarInfo();
        // // 显示门诊处信息
        // displayOutpatient();
        // // 显示药房处信息
        // // displayDispensing();
        // // 显示患者处信息
        // displayPatientStand();
        // // 显示 ql 中的信息
        // displayQuickList()
    } else if (event.keyCode === 27) {
        // 移除所有的 tooltip 元素
        if (latestModule == null) {
            return;
        }

        latestModule.hiddenTip();
    }
});
export {}