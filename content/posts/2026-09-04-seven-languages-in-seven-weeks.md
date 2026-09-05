---
tags: Language
---

# Seven Languages in Seven Weeks

Chapter 3: Io

DSL = Domain-Specific Language，领域特定语言

在编程语言（特别是你提到的 **Io 语言**）的语境下，**`forward`** 是一个非常强大的元编程特性，通常被称为**“前向引导”**或**“消息转发”**。

简单来说，它的作用是：**“当一个对象收到它不知道如何处理的消息时，该怎么办？”**

以下是详细解释：

在 Io 语言中，当你向一个对象发送一个消息（调用一个方法），如果该对象及其原型链中都没有定义这个方法，Io 解释器不会立即抛出错误，而是会去寻找一个名为 `forward` 的特殊方法。

如果你熟悉其他编程语言，`forward` 的功能等同于：
*   **Ruby** 中的 `method_missing`
*   **Smalltalk** 中的 `doesNotUnderstand:`
*   **Python** 中的 `__getattr__` 或 `__getattribute__`
*   **JavaScript (ES6+)** 中的 `Proxy` 对象的 `get` 陷阱

**举个例子：**
假设你想用 Io 写 HTML。你可能想直接写 `html(body(h1("Hello")))`。
*   通常情况下，如果你的代码里没定义 `html`、`body` 或 `h1` 这些方法，程序会崩溃。
*   但是，如果你定义了 `forward` 方法，你可以让它拦截这些“不存在的方法名”。
*   当调用 `html(...)` 时，`forward` 被触发，它拿到“html”这个名字，然后自动生成一个 `<html ...>` 标签。

它允许对象将处理请求的责任**转发**给另一个地方（比如另一个对象，或者一个通用的处理逻辑），而不是直接报错。

`forward` 是 Io 语言的一种**“兜底”机制**。它允许程序动态地响应那些在编写代码时还不存在的方法调用，是实现动态代理、装饰器模式和灵活 DSL 的核心工具。

