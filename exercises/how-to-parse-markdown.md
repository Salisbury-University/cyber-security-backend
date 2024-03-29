---
title: "How to parse markdown"
description: "Convert markdown into HTML. Markdown files are plain text files containing text inline symbols for formatting the text (e.g., titles, bold, tables), intending to make the writing for the internet more accessible. In this challenge you will write a program which contains simplified Markdown-like Markup, and outputs the corresponding HTML Markup."
author: "Christopher"
created: 04/11/2022 15:30:22
updated: 04/11/2022 15:31:00
vm: 100
hidden: false
timelimit: "4h"
difficulty: "Medium"
categories: ["sql", "tcp", "attack on titan"]
image: "https://th.bing.com/th/id/R.f15ba0ca3dc1e956f690880ab0fd74c8?rik=CZ784tKSsGErvw&pid=ImgRaw&r=0"
---

# How to parse markdown

## Frontmatter

Frontmatter is an optional key-value store at the beginning of a markdown file. Frontmatter can be identified by the surrounding dashes above and below.

```markdown
---
title: "How to parse markdown"
description: "I'm too sleepy for this"
author: "Christopher"
created: 04/11/2022 15:30:22
updated: 04/11/2022 15:31:00
vm: 100
hidden: false
timelimit: "4h"
difficulty: 2
categories: ["sql", "tcp", "attack on titan"]
image: "path/to/some/image.png"
---
```

## Key-values

If the library we are using for markdown doesn't support frontmatter parsing, that's fine. We'll just have to write it ourselves.

In the event we do have to write it ourselves, we should make the parser as flexible as possible, in the event we want to change the key name.

Note: I didn't try parsing these myself. so feel free to

## Date Parsing

Parse the date with Date.parse. It should give you a unixtime that is usable for creating a normal date string.

## Markdown / Content

This should entirely be handled by whatever library we use, marked, mdx, etc

## Future frontmatter keys

In the future we might look to add functionality by implementing new keys, such as

- categories
- toc
- description
- search_exclude ?
