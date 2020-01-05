export declare class Shortcuts {
    /**
     * 所有快捷键
    */
    allShortcuts: any;
    /**
     * 添加快捷键监听
     * @param shortcutCombination 快捷键（支持组合键）的名称 如 'Ctrl+C'
     * @param callback 快捷键绑定的回调
     * @param opt 设置选项 { type, propagate, disable_in_input, target, keycode }
     */
    add(shortcutCombination: string, callback: Function, opt?: any): void;
    /**
     * 删除已经绑定的快捷按键
     * @param shortcutCombination 要删除的快捷键的名称 如 'Ctrl+C'
     */
    remove(shortcutCombination: string): void;
}
declare const bindkey: Shortcuts;
export default bindkey;
