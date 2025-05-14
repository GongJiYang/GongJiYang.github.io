import { parse as djot_parse } from "@djot/djot";
import { HTMLRenderer, renderHTML } from "@djot/djot";

import { highlight } from "./highlight.ts";
import { HtmlString, time } from "./templates.ts";

import type {
    AstNode,
    BlockQuote,
    CodeBlock,
    Div,
    Doc,
    Heading,
    Image,
    OrderedList,
    Para,
    Section,
    Span,
    Str,
    Url,
    Visitor,
} from "@djot/djot"


export function parse(source: string): Doc {
    return djot_parse(source);
}

type RenderCtx = {
    date?: Date;
    summary?: string;
    title?: string;
};

//将 Djot 解析后的 文档 (Doc) 转换为 HTML (HtmlString)
export function render(doc: Doc, ctx: RenderCtx): HtmlString {
    //跟踪当前正在解析的 Djot Section
    let section: Section | undefined = undefined;
    //自定义渲染规则，用于覆盖默认的 HTML 生成逻辑
    const overrides: Visitor<HTMLRenderer, string> = {
        section: (node: Section, r: HTMLRenderer): string => {
            const section_prev = section; // 保存当前的 section 状态
            section = node; // 进入新的 section
            const result = get_child(node, "heading")?.level == 1
                ? r.renderChildren(node)// 如果 section 内的标题是 H1，则直接渲染子元素
                : r.renderAstNodeDefault(node);// 否则使用默认渲染逻辑
            section = section_prev; // 还原之前的 section 状态
            return result;
        },
        heading: (node: Heading, r: HTMLRenderer) => {
            const tag = `h${node.level}`; //根据 node.level 确定 HTML 标签
            const date = node.level == 1 && ctx.date //如果 level === 1 且 ctx.date 存在，就给 h1 加上时间信息
                ? time(ctx.date, "meta").value
                : "";
            const children = r.renderChildren(node);//渲染 heading 里的 子元素
            if (node.level == 1) ctx.title = get_string_content(node); //如果是 h1 级标题，就把标题文本存入 ctx.title
            const id = node.level > 1 && section?.attributes?.id;//如果是 h2 及以上 (node.level > 1)，并且 section 有 id，就把 id 提取出来
            if (id) { //如果 id 存在，则生成一个带有跳转链接的标题
                return `
                    <${tag}${r.renderAttributes(node)}>
                    <a href="#${id}">${children} ${date}</a>
                    </${tag}>\n`;
            } else { //直接渲染
                return `\n<${tag}${r.renderAttributes(node)
                    }>${children} ${date}</${tag}>\n`;
            }
        },
        //如果 ordered_list 采用 "1)" 风格，就给它加上 "callout" 类名
        ordered_list: (node: OrderedList, r: HTMLRenderer): string => {
            if (node.style === "1)") add_class(node, "callout");
            return r.renderAstNodeDefault(node);
        },
        //如果 Para（段落）里只有一个 image（图片）节点，就把它变成 <figure>，并处理标题（caption）
        para: (node: Para, r: HTMLRenderer) => {
            if (node.children.length == 1 && node.children[0].tag == "image") {
                node.attributes = node.attributes || {};
                let cap = extract_cap(node);
                if (cap) {
                    cap = `<figcaption class="title">${cap}</figcaption>\n`;
                } else {
                    cap = "";
                }
                //把图片封装进 <figure> 标签（
                return `
                        <figure${r.renderAttributes(node)}>
                            ${cap}
                            ${r.renderChildren(node)}
                        </figure>
                    `;
            }
            const result = r.renderAstNodeDefault(node);
            if (!ctx.summary) ctx.summary = get_string_content(node);//如果 ctx.summary 为空，就把当前 Para 的文本内容作为摘要
            return result;
        },
        // 引用块（BlockQuote）
        block_quote: (node: BlockQuote, r: HTMLRenderer) => {
            let source = undefined;
            if (node.children.length > 0) { //如果 BlockQuote 里有内容，检查它的最后一个子节点 last_child
                const last_child: { tag: string; children?: AstNode[] } =
                    node.children[node.children.length - 1];
                if ( //检查 last_child 是否是引用来源
                    last_child.tag != "thematic_break" &&
                    last_child?.children?.length == 1 &&
                    last_child?.children[0].tag == "link"
                ) {
                    source = last_child.children[0];
                    node.children.pop();
                }
            }
            const cite = source //生成 <cite>
                ? `<figcaption><cite>${r.renderAstNode(source)}</cite></figcaption>`
                : "";

            return `
                    <figure class="blockquote">
                        <blockquote>${r.renderChildren(node)}</blockquote>
                        ${cite}
                    </figure>
                `;
        },
        // 处理不同类型的 div
        div: (node: Div, r: HTMLRenderer): string => {
            let admon_icon = "";
            if (has_class(node, "note")) admon_icon = "info";
            if (has_class(node, "quiz")) admon_icon = "question";
            if (has_class(node, "warn")) admon_icon = "exclamation";
            if (admon_icon) { //如果 div 是 note/quiz/warn，转换成 <aside>
                return `
                        <aside${r.renderAttributes(node, { "class": "admn" })}>
                            <svg class="icon"><use href="/assets/icons.svg#${admon_icon}"/></svg>
                            <div>${r.renderChildren(node)}</div>
                        </aside>
                    `;
            }

            if (has_class(node, "block")) {
                let cap = extract_cap(node);
                if (cap) {
                    cap = `<div class="title">${cap}</div>`;
                } else {
                    cap = "";
                }
                return `
                        <aside${r.renderAttributes(node)}>
                            ${cap}
                            ${r.renderChildren(node)}
                        </aside>
                    `;
            }

            if (has_class(node, "details")) {
                return `
                        <details>
                            <summary>${extract_cap(node)}</summary>
                            ${r.renderChildren(node)}
                        </details>
                    `;
            }

            return r.renderAstNodeDefault(node);
        },
        //高亮代码块
        code_block: (node: CodeBlock) => {
            let cap = extract_cap(node);
            if (cap) {
                cap = `<figcaption class="title">${cap}</figcaption>\n`;
            } else {
                cap = "";
            }

            const pre = highlight(
                node.text,
                node.lang,
                node.attributes?.highlight,
            ).value;
            return `
                    figure class="code-block">
                        ${cap}
                        ${pre}
                    </figure>
                `;
        },
        // 视频渲染
        image: (node: Image, r: HTMLRenderer): string => {
            if (has_class(node, "video")) {
                if (!node.destination) throw "missing destination";
                if (has_class(node, "loop")) {
                    return `<video src="${node.destination}" autoplay muted=true loop=true></video>`;
                } else {
                    return `<video src="${node.destination}" controls muted=true></video>`;
                }
            }
            return r.renderAstNodeDefault(node);
        },
        //对特定 内联格式 进行处理
        span: (node: Span, r: HTMLRenderer) => {
            if (has_class(node, "code")) {
                const children = r.renderChildren(node);
                return `<code>${children}</code>`;
            }
            if (has_class(node, "dfn")) {
                const children = r.renderChildren(node);
                return `<dfn>${children}</dfn>`;
            }
            if (has_class(node, "kbd")) {
                const children = get_string_content(node)
                    .split("+")
                    .map((it) => `<kbd>${it}</kbd>`)
                    .join("+");
                return `<kbd>${children}</kbd>`;
            }
            if (has_class(node, "menu")) {
                return r.renderAstNodeDefault(node).replaceAll(
                    "&gt;",
                    "›",
                );
            }
            return r.renderAstNodeDefault(node);
        },
        //处理 Str（普通文本）
        str: (node: Str, r: HTMLRenderer) => {
            if (has_class(node, "dfn")) {
                return `<dfn>${node.text}</dfn>`;
            }
            return r.renderAstNodeDefault(node);
        },
        //处理 Url（超链接）
        url: (node: Url, r: HTMLRenderer) => {
            add_class(node, "url");
            return r.renderAstNodeDefault(node);
        },
    };
    //将 Markdown 解析后的 doc 渲染为 HTML 字符串，并返回一个 HtmlString 对象
    const result = renderHTML(doc, { overrides });
    return new HtmlString(result);
}

type AstTag = AstNode["tag"];

// ?? 在 AST（抽象语法树）节点中查找第一个匹配指定 tag 的子节点，如果找到就返回该节点，否则返回 undefined
function get_child<Tag extends AstTag>(
    node: AstNode,
    tag: Tag,
): Extract<AstNode, { tag: Tag }> | undefined {
    for (const child of (node as { children?: AstNode[] })?.children ?? []) {
        if (child.tag == tag) return child as Extract<AstNode, { tag: Tag }>;
    }
    return undefined;
}
// 检查 AST（抽象语法树）节点是否具有指定的 CSS 类
function has_class(node: AstNode, cls: string): boolean {
    node.attributes = node.attributes || {};
    const attr = node.attributes?.["class"] || "";
    return attr.split(" ").includes(cls);
}

// 向 AST（抽象语法树）节点添加 CSS 类
function add_class(node: AstNode, cls: string) {
    node.attributes = node.attributes || {};
    const attr = node.attributes["class"];
    node.attributes["class"] = attr ? `${attr} ${cls}` : cls;
}

//提取并删除 node.attributes.cap，然后返回它的值
function extract_cap(node: AstNode): string | undefined {
    if (node.attributes?.cap) {
        const result = node.attributes.cap;
        delete node.attributes.cap;
        return result;
    }
}

//获取 AstNode 的文本内容，将它的所有子节点拼接成一个字符串
const get_string_content = function (node: AstNode): string {
    const buffer: string[] = [];
    add_string_content(node, buffer);
    return buffer.join("");
};

//AstNode 的递归遍历
const add_string_content = function (
    node: AstNode,
    buffer: string[],
): void {
    if ("text" in node) {
        buffer.push(node.text);
    } else if (
        "tag" in node &&
        (node.tag === "soft_break" || node.tag === "hard_break")
    ) {
        buffer.push("\n");
    } else if ("children" in node) {
        for (const child of node.children) {
            add_string_content(child, buffer);
        }
    }
};