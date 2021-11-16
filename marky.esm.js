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
function bold(block) {
  const matches = block.match(/\*\*.*?\*\*/g);
  if (matches) {
    for (const match of matches) {
      const value = match.substring(2, match.length - 2);
      const replacement = `<strong>${value}</strong>`;
      block = block.replace(match, replacement);
    }
  }
  return block;
}
function createBlocks(content, parsers) {
  let blocks = content.split(/\n\n/);
  blocks = stitchCodeBlocks(blocks);
  return blocks.map((block) => {
    const match = parsers.find((parser) =>
      parser.matcher && parser.matcher(block)
    );
    if (match) {
      for (const renderer of match.renderers) {
        block = renderer(block);
      }
      return block;
    }
    const parsersWithoutMatcher = parsers.filter((parser) => !parser.matcher);
    for (const parser of parsersWithoutMatcher) {
      for (const renderer of parser.renderers) {
        block = renderer(block);
      }
    }
    return block;
  }).join("");
}
function marky1(content, parsers = defaultParsers) {
  return createBlocks(content, parsers);
}
function italic(block) {
  const matches = block.match(/_.*?_/g);
  if (matches) {
    for (const match of matches) {
      const value = match.substring(1, match.length - 1);
      const replacement = `<em>${value}</em>`;
      block = block.replace(match, replacement);
    }
  }
  return block;
}
function inlineCode(block) {
  const matches = block.match(/\`.*?\`/g);
  if (matches) {
    for (const match of matches) {
      const value = match.substring(1, match.length - 1);
      const replacement = `<code>${value}</code>`;
      block = block.replace(match, replacement);
    }
  }
  return block;
}
function strikethrough(block) {
  const matches = block.match(/~~.*?~~/g);
  if (matches) {
    for (const match of matches) {
      const value = match.substring(2, match.length - 2);
      const replacement = `<del>${value}</del>`;
      block = block.replace(match, replacement);
    }
  }
  return block;
}
function linkAndImage(block) {
  const matches = block.match(/\[(.*?)\]\((.*?)\)/g);
  if (matches) {
    for (const match of matches) {
      const isImage = block[block.indexOf(match) - 1] === "!";
      const label = match.substring(match.indexOf("[") + 1, match.indexOf("]"));
      const href = match.substring(match.indexOf("(") + 1, match.indexOf(")"));
      if (isImage) {
        block = block.replace(
          "!" + match,
          `<img src="${href}" alt="${label}">`,
        );
      } else {
        block = block.replace(match, `<a href="${href}">${label}</a>`);
      }
    }
  }
  return block;
}
function isEmptyBlock(block) {
  return block.trim() === "";
}
function emptyBlock(_block) {
  return "";
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
    if (value.split("\n")[0].trim() === "") {
      value = value.replace("\n", "");
    }
    value = value.replace(/&/g, "&amp;");
    value = value.replace(/</g, "&lt;");
    value = value.replace(/>/g, "&gt;");
    value = value.replaceAll("\n", "<br>");
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
  return block.replaceAll("\n", "").trim().startsWith(">");
}
function quoteBlock(block) {
  const matches = block.match(/>.*/g);
  if (matches) {
    return `<blockquote>${
      marky1(
        matches.map((match) => {
          return match.substring(1);
        }).join("\n"),
      )
    }</blockquote>`;
  }
  return block;
}
function isListBlock(block) {
  return !!block.match(/\n-?\s?-?\s?(\*\s.*|\d\.\s.*)[^\*]/g);
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
        result += marky1(captured);
      } else {
        result += `<li>${match.substring(2).trim()}</li>`;
      }
    });
    result += isOrderedList ? `</ol>` : `</ul>`;
    return result;
  }
  return block;
}
function paragraphBlock(block) {
  return `<p>${block.trim()}</p>`;
}
const defaultParsers = [
  {
    matcher: isEmptyBlock,
    renderers: [
      emptyBlock,
    ],
  },
  {
    matcher: isHeadingBlock,
    renderers: [
      bold,
      italic,
      inlineCode,
      strikethrough,
      linkAndImage,
      headingBlock,
    ],
  },
  {
    matcher: isCodeBlock,
    renderers: [
      codeBlock,
    ],
  },
  {
    matcher: isHorizontalLineBlock,
    renderers: [
      horizontalLineBlock,
    ],
  },
  {
    matcher: isQuoteBlock,
    renderers: [
      quoteBlock,
    ],
  },
  {
    matcher: isListBlock,
    renderers: [
      bold,
      italic,
      inlineCode,
      strikethrough,
      linkAndImage,
      listBlock,
    ],
  },
  {
    renderers: [
      bold,
      italic,
      inlineCode,
      strikethrough,
      linkAndImage,
      paragraphBlock,
    ],
  },
];
export { marky1 as marky };
