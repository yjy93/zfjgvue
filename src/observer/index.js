// 观测数据

import {arrayMethods} from "../array"

class Observer {
    constructor(value) { // 对这个 value 属性, 重新定义
        // value.__ob__ = this
        Object.defineProperty(value, '__ob__', {
            value: this,
            enumerable: false, // 不能被枚举,表示不能被循环
            configurable: false, // 不能删除此属性
        })
        // value 可能是对象, 也可能是数组, 分类处理
        if (Array.isArray(value)) {
            // 数组不用 defineProperty 来进行代理, 新能不好
            // value.__proto__.arrayMethods; // 当时数组时, 改写方法为自己重写后的方法?
            Object.setPrototypeOf(value, arrayMethods)
            this.observeArray(value) // 观测数组中的数据
        } else {
            this.walk(value)
        }
    }

    observeArray(value) {
        for (let i = 0; i < value.length; i++) {
            observe(value[i]) // 处理的是 原有数组中的对象
        }
    }


    walk(data) {
        // 将对象中的所有 key, 重新用 defineProperty 定义成响应式的
        Object.keys(data).forEach((key) => {
            //
            defineReactive(data, key, data[key])
        })
    }
}

export function defineReactive(data, key, value) {
    // value 可能也是一个对象
    observe(value); // 对结果递归拦截

    Object.defineProperty(data, key, { // vue2 中数据不要嵌套过深, 过深会浪费性能
        get() {
            return value
        },
        set(newValue) {
            if (newValue === value) return;
            observe(newValue) // 如果用户设置的是一个对象, 就继续将该用户设置的对象变成响应式的
            value = newValue
        }
    })
}

export function observe(data) {
    // 我们需要对这个 数据进行重新定义
    // 只对对象类型进行观测, 非对象类型无法观测
    if (typeof data !== 'object' || data == null) {
        return;
    }

    if (data.__ob__) { // 防止循环引用了
        return
    }

    // 通过类来实现对数据的观测 类可以方便扩展
    return new Observer(data)
}
