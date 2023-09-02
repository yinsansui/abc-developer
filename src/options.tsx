import React, {useEffect} from 'react';
import {Button, Form, Input,} from 'antd';
import {useImmer} from "use-immer";
import {Command} from "~popup";

/**
 * 键盘映射配置
 */
export class KeymapConfig {
    displayTipShortCat: string
}

/**
 * 显示配置
 */
class DisplayConfig {
    /**
     * 是否显示 shortId
     */
    displayShortId: boolean;
    /**
     * 是否显示处方信息
     */
    displayFormInfo: boolean;
}

export class AppConfig {
    keymapConfig: KeymapConfig;
    displayConfig: DisplayConfig;
}

const App: React.FC = () => {
    let localAppConfig: AppConfig = JSON.parse(localStorage.getItem("appConfig"));
    if (!localAppConfig) {
        localAppConfig = {
            keymapConfig: {
                displayTipShortCat: 'ctrl+k'
            },
            displayConfig: {
                displayShortId: true,
                displayFormInfo: true
            }
        };
    }

    const [appConfig, setAppConfig] = useImmer<AppConfig>(localAppConfig);
    const keymapConfig = appConfig.keymapConfig;

    useEffect(() => {
        localStorage.setItem('appConfig', JSON.stringify(appConfig));
        sendUpdateAppConfigMessage(appConfig);
    }, [appConfig]);

    function sendUpdateAppConfigMessage(appConfig: AppConfig) {
        const command: Command = {cmd: 'updateAppConfig', data: appConfig};
        chrome.runtime.sendMessage(command);
    }

    function handleFormSubmit(keymapConfig: KeymapConfig) {
        if (!keymapConfig) {
            return;
        }
        setAppConfig(draft => {
            draft.keymapConfig = keymapConfig;
        })
    }

    return (
        <>
            <Form<KeymapConfig> name="keymapConfigForm"
                                labelCol={{span: 8}}
                                wrapperCol={{span: 16}}
                                style={{maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', marginTop: '200px'}}
                                initialValues={keymapConfig}
                                onFinish={handleFormSubmit}
            >
                <Form.Item name="displayTipShortCat" label="显示提示快捷键">
                    <Input style={{width: 200}}/>
                </Form.Item>
                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">保存</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default App;