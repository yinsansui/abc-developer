import {useState} from "react"

/**
 * 键盘映射配置
 */
class KeyMapConfig {



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

function IndexOptions() {
    const [data, setData] = useState("")

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: 16
            }}>
            <h1>
                Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
            </h1>
            <input onChange={(e) => setData(e.target.value)} value={data}/>
            <footer>Crafted by @PlamoHQ</footer>
            {" "}
        </div>
    )
}

export default IndexOptions
