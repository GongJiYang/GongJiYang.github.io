// bun-compatible version
import Parser from "rss-parser";
import fs from "fs/promises";

// 从 content/blogroll.txt 文件中读取博客链接
export async function blogroll(): Promise<FeedEntry[]> {
  const urls = (await fs.readFile("content/blogroll.txt", "utf-8"))
    .split("\n").filter((line) => line.trim().length > 0);
  const all_entries = (await Promise.all(urls.map(blogroll_feed))).flat();
  all_entries.sort((a, b) => b.date.getTime() - a.date.getTime());
  return all_entries;
}

//博客条目的结构
export interface FeedEntry {
  title: string;
  url: string;
  date: Date;
}

async function blogroll_feed(url: string): Promise<FeedEntry[]> {
  const response = await fetch(url); //获取 RSS 数据
  const xml = await response.text(); //读取响应的文本内容
  const parser = new Parser();
  const feed = await parser.parseString(xml); //解析 XML 数据
  
  return feed.items.map((entry) => { //映射条目为 FeedEntry 对象
    return {
      title: entry.title || "",
      url: entry.link || "",
      date: new Date(entry.pubDate || entry.isoDate || Date.now()),
    };
  }).slice(0, 3);
}