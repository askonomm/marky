const pipe = (x, ...fns) => fns.reduce((x, fn) => fn(x), x);
function bold(content) {
  const matches = content.match(/\*\*.*?\*\*/g);
  if (matches) {
    for (const match of matches) {
      const value = match.substring(2, match.length - 2);
      const replacement = `<strong>${value}</strong>`;
      content = content.replace(match, replacement);
    }
  }
  return content;
}
function italic(content) {
  const matches = content.match(/_.*?_/g);
  if (matches) {
    for (const match of matches) {
      const value = match.substring(1, match.length - 1);
      const replacement = `<em>${value}</em>`;
      content = content.replace(match, replacement);
    }
  }
  return content;
}
function inlineCode(content) {
  const matches = content.match(/\`.*?\`/g);
  if (matches) {
    for (const match of matches) {
      const value = match.substring(1, match.length - 1);
      const replacement = `<code>${value}</code>`;
      content = content.replace(match, replacement);
    }
  }
  return content;
}
function strikethrough(content) {
  const matches = content.match(/~~.*?~~/g);
  if (matches) {
    for (const match of matches) {
      const value = match.substring(2, match.length - 2);
      const replacement = `<del>${value}</del>`;
      content = content.replace(match, replacement);
    }
  }
  return content;
}
function linkAndImage(content) {
  const matches = content.match(/\[(.*?)\]\((.*?)\)/g);
  if (matches) {
    for (const match of matches) {
      const isImage = content[content.indexOf(match) - 1] === "!";
      const label = match.substring(match.indexOf("[") + 1, match.indexOf("]"));
      const href = match.substring(match.indexOf("(") + 1, match.indexOf(")"));
      if (isImage) {
        content = content.replace(
          "!" + match,
          `<img src="${href}" alt="${label}">`,
        );
      } else {
        content = content.replace(match, `<a href="${href}">${label}</a>`);
      }
    }
  }
  return content;
}
function isHeadingBlock(block) {
  return block.replaceAll("\n", "").trim().startsWith("#");
}
function headingBlock(block) {
  const singleLineBlock = block.replaceAll("\n", "").trim();
  const sizeIndicators = singleLineBlock.split(" ")[0].trim();
  const size = sizeIndicators.length;
  const value = singleLineBlock.split(" ").slice(1).join(" ").trim();
  return `<h${size}>${value}</h${size}>`;
}
function isCodeBlock(block) {
  const singleLineBlock = block.replaceAll("\n", "").trim();
  return singleLineBlock.startsWith("```") && singleLineBlock.endsWith("```");
}
function codeBlock(block) {
  const languageMatch = block.match(/\`\`\`\w+/);
  const language = languageMatch
    ? languageMatch[0].replace("```", "").trim()
    : false;
  let value = "";
  if (language) {
    value = block.replace(/\`\`\`\w+/, "").replace(/\n\`\`\`/, "");
    return `<pre class="language-${language}"><code>${value}</code></pre>`;
  }
  return `<pre><code>${block.substring(3, block.length - 3)}</code></pre>`;
}
function isHorizontalLineBlock(block) {
  return block.replaceAll("\n", "").trim() === "***";
}
function horizontalLineBlock() {
  return `<hr>`;
}
function isQuoteBlock(block) {
  return !!block.match(/>.*/g);
}
function quoteBlock(block) {
  const matches = block.match(/>.*/g);
  if (matches) {
    return `<blockquote>${
      createBlocks(
        matches.map((match) => {
          return match.substring(1);
        }).join("\n"),
      )
    }</blockquote>`;
  }
  return block;
}
function isListBlock(block) {
  return !!block.match(/-?\s?-?\s?(\*\s.*|\d\.\s.*)[^\*]/g);
}
function listBlock(block) {
  const matches = block.match(/-?\s?-?\s?(\*\s.*|\d\.\s.*)[^\*]/g);
  const isOrderedList = matches && !matches[0].startsWith("*");
  const skipIndexes = [];
  let result = "";
  if (matches) {
    result += isOrderedList ? `<ol>` : `<ul>`;
    matches.forEach((match, index) => {
      if (skipIndexes.includes(index)) {
        return;
      }
      if (match.startsWith("-")) {
        let captured = match.substring(2);
        let nextIndex = index + 1;
        skipIndexes.push(...[
          index,
          nextIndex,
        ]);
        while (
          typeof matches[nextIndex] !== "undefined" &&
          matches[nextIndex].startsWith("-")
        ) {
          captured += matches[nextIndex].substring(2);
          nextIndex += 1;
        }
        result += createBlocks(captured);
      } else {
        result += `<li>${match.substring(2).trim()}</li>`;
      }
    });
    result += isOrderedList ? `</ol>` : `</ul>`;
    return result;
  }
  return block;
}
function stitchCodeBlocks(blocks) {
  const capturedBlocks = [];
  const codeBlockIndexes = [];
  blocks.forEach((block, index) => {
    if (block.trim().startsWith("```") && !block.trim().endsWith("```")) {
      let capturingBlock = block;
      let nextIndex = index + 1;
      codeBlockIndexes.push(...[
        index,
        nextIndex,
      ]);
      while (
        typeof blocks[nextIndex] !== "undefined" &&
        !blocks[nextIndex].trim().endsWith("```")
      ) {
        if (!codeBlockIndexes.length) {
          capturingBlock += blocks[nextIndex];
        } else {
          capturingBlock += "\n\n" + blocks[nextIndex];
        }
        nextIndex += 1;
        codeBlockIndexes.push(nextIndex);
      }
      capturingBlock += "\n\n" + blocks[nextIndex];
      capturedBlocks.push(capturingBlock);
    } else if (!codeBlockIndexes.includes(index)) {
      capturedBlocks.push(block);
    }
  });
  return capturedBlocks;
}
function paragraphBlock(block) {
  return `<p>${block.replaceAll("\n", "").trim()}</p>`;
}
function createBlocks(content) {
  const blocks = pipe(content.split(/\n\n/), stitchCodeBlocks);
  return blocks.map((block) => {
    if (block.trim() === "") {
      return "";
    }
    if (isHeadingBlock(block)) {
      return pipe(
        block,
        bold,
        italic,
        inlineCode,
        strikethrough,
        linkAndImage,
        headingBlock,
      );
    }
    if (isCodeBlock(block)) {
      return codeBlock(block);
    }
    if (isHorizontalLineBlock(block)) {
      return horizontalLineBlock();
    }
    if (isQuoteBlock(block)) {
      return quoteBlock(block);
    }
    if (isListBlock(block)) {
      return pipe(
        block,
        bold,
        italic,
        inlineCode,
        strikethrough,
        linkAndImage,
        listBlock,
      );
    }
    return pipe(
      block,
      bold,
      italic,
      inlineCode,
      strikethrough,
      linkAndImage,
      paragraphBlock,
    );
  }).join("");
}
function marky1(content) {
  return createBlocks(content);
}
export { marky1 as marky };
