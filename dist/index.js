"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Shortcuts = /** @class */ (function () {
    function Shortcuts() {
        /**
         * 所有快捷键
        */
        this.allShortcuts = {};
    }
    /**
     * 添加快捷键监听
     * @param shortcutCombination 快捷键（支持组合键）的名称 如 'Ctrl+C'
     * @param callback 快捷键绑定的回调
     * @param opt 设置选项 { type, propagate, disable_in_input, target, keycode }
     */
    Shortcuts.prototype.add = function (shortcutCombination, callback, opt) {
        var defaultOptions = {
            type: 'keydown',
            propagate: false,
            disableInInput: false,
            target: document,
            keycode: false
        };
        opt = __assign({}, defaultOptions, opt);
        var ele = opt.target;
        if (typeof opt.target === 'string') {
            ele = document.querySelector(opt.target);
        }
        shortcutCombination = shortcutCombination.toLowerCase();
        /**
         * keypress 时执行的方法
         * @param e KeyboardEvent 键盘事件参数
         */
        var func = function (e) {
            if (opt['disableInInput']) {
                // 在 input 和 textarea 中禁用快捷键
                var element = document.body;
                if (e.target) {
                    element = e.target;
                }
                else if (e.srcElement) {
                    element = e.srcElement;
                }
                if (element.nodeType === 3) {
                    element = element.parentNode;
                }
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')
                    return;
            }
            // 被按下键的 keycode
            var code = 0;
            if (e.keyCode) {
                code = e.keyCode;
            }
            else if (e.which) {
                code = e.which;
            }
            var character = String.fromCharCode(code).toLowerCase();
            if (code === 188) {
                character = ',';
            }
            if (code === 190) {
                character = '.';
            }
            var keys = shortcutCombination.split('+');
            // 统计有效按键的数目 如果与按键数目相同，则调用绑定的函数
            var kp = 0;
            // 解决使用 Shift + 小写字母创建的错误快捷键
            var shiftNums = {
                '`': '~',
                '1': '!',
                '2': '@',
                '3': '#',
                '4': '$',
                '5': '%',
                '6': '^',
                '7': '&',
                '8': '*',
                '9': '(',
                '0': ')',
                '-': '_',
                '=': '+',
                ';': ':',
                "'": '"',
                ',': '<',
                '.': '>',
                '/': '?',
                '\\': '|'
            };
            // 特殊键的 keycode
            var specialKeys = {
                esc: 27,
                escape: 27,
                tab: 9,
                space: 32,
                return: 13,
                enter: 13,
                backspace: 8,
                scrolllock: 145,
                scroll_lock: 145,
                scroll: 145,
                capslock: 20,
                caps_lock: 20,
                caps: 20,
                numlock: 144,
                num_lock: 144,
                num: 144,
                pause: 19,
                break: 19,
                insert: 45,
                home: 36,
                delete: 46,
                end: 35,
                pageup: 33,
                page_up: 33,
                pu: 33,
                pagedown: 34,
                page_down: 34,
                pd: 34,
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                f1: 112,
                f2: 113,
                f3: 114,
                f4: 115,
                f5: 116,
                f6: 117,
                f7: 118,
                f8: 119,
                f9: 120,
                f10: 121,
                f11: 122,
                f12: 123
            };
            var modifiers = {
                shift: { wanted: false, pressed: false },
                ctrl: { wanted: false, pressed: false },
                alt: { wanted: false, pressed: false },
                meta: { wanted: false, pressed: false }
                // Meta 是 Mac 特有的
            };
            if (e.ctrlKey)
                modifiers.ctrl.pressed = true;
            if (e.shiftKey)
                modifiers.shift.pressed = true;
            if (e.altKey)
                modifiers.alt.pressed = true;
            if (e.metaKey)
                modifiers.meta.pressed = true;
            var k;
            for (var i = 0; i < keys.length; i++) {
                k = keys[i];
                if (k === 'ctrl' || k === 'control') {
                    kp++;
                    modifiers.ctrl.wanted = true;
                }
                else if (k === 'shift') {
                    kp++;
                    modifiers.shift.wanted = true;
                }
                else if (k === 'alt') {
                    kp++;
                    modifiers.alt.wanted = true;
                }
                else if (k === 'meta') {
                    kp++;
                    modifiers.meta.wanted = true;
                }
                else if (k.length > 1) {
                    // 如果是 特殊键
                    if (specialKeys[k] === code) {
                        kp++;
                    }
                }
                else if (opt['keycode']) {
                    if (opt['keycode'] === code) {
                        kp++;
                    }
                }
                else {
                    // 没有匹配的 特殊键
                    if (character === k) {
                        kp++;
                    }
                    else {
                        if (shiftNums[character] && e.shiftKey) {
                            // 使用小写创建 shift 键
                            character = shiftNums[character];
                            if (character === k) {
                                kp++;
                            }
                        }
                    }
                }
            }
            if (kp === keys.length &&
                modifiers.ctrl.pressed === modifiers.ctrl.wanted &&
                modifiers.shift.pressed === modifiers.shift.wanted &&
                modifiers.alt.pressed === modifiers.alt.wanted &&
                modifiers.meta.pressed === modifiers.meta.wanted) {
                callback(e);
                if (!opt['propagate']) {
                    // 阻止事件传递
                    // IE下使用 e.cancelBubble 阻止事件冒泡
                    e.cancelBubble = true;
                    e.returnValue = false;
                    // Firefox 使用 e.stopPropagation 阻止事件冒泡
                    if (e.stopPropagation) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    return false;
                }
            }
        };
        this.allShortcuts[shortcutCombination] = {
            callback: func,
            target: ele,
            event: opt['type']
        };
        // 将函数绑定到事件
        if (ele.addEventListener) {
            ele.addEventListener(opt['type'], func, false);
        }
        else if (ele.attachEvent) {
            ele.attachEvent('on' + opt['type'], func);
        }
        else {
            ele['on' + opt['type']] = func;
        }
    };
    /**
     * 删除已经绑定的快捷按键
     * @param shortcutCombination 要删除的快捷键的名称 如 'Ctrl+C'
     */
    Shortcuts.prototype.remove = function (shortcutCombination) {
        shortcutCombination = shortcutCombination.toLowerCase();
        var binding = this.allShortcuts[shortcutCombination];
        delete this.allShortcuts[shortcutCombination];
        if (!binding)
            return;
        var type = binding['event'];
        var ele = binding['target'];
        var callback = binding['callback'];
        if (ele.detachEvent) {
            ele.detachEvent('on' + type, callback);
        }
        else if (ele.removeEventListener) {
            ele.removeEventListener(type, callback, false);
        }
        else {
            ele['on' + type] = false;
        }
    };
    return Shortcuts;
}());
exports.Shortcuts = Shortcuts;
var bindkey = new Shortcuts();
exports.default = bindkey;
