const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const toml = require("@iarna/toml");
const markdoc = require("@urbit/markdoc");
const { Markdown } = require("@urbit/fdn-design-system");

const options = {
  engines: {
    toml: toml.parse.bind(toml),
  },
  language: "toml",
  delimiters: "+++",
};

const index = {};

function buildSearchIndex(dir, titleSlug = []) {
  const dirName = dir.split("/").slice(-1).join("");
  let metadata = {
    data: {
      title: dirName.charAt(0).toUpperCase() + dirName.slice(1),
    },
  };

  try {
    metadata = matter(fs.readFileSync(path.join(dir, "_index.md")), options);
  } catch (err) {}

  const children = fs.readdirSync(dir, { withFileTypes: true });
  const pages = children.filter((f) => f.isFile() && f.name !== "_index.md");
  const subdirs = children.filter(
    (f) => f.isDirectory() && f.name !== "directory"
  );

  let indexData;
  try {
    indexData = matter(
      fs.readFileSync(path.join(dir, "_index.md")),
      options
    ).data;
  } catch (_) {}

  pages.forEach((page) => {
    const { data: pageData, content: pageContent } = matter(
      fs.readFileSync(path.join(dir, page.name)),
      options
    );

    // const parsed = markdoc.parse(pageContent);
    // const transform = markdoc.transform(parsed);
    const transform = Markdown.parse({
      post: { content: String.raw`${pageContent}` },
    });
    const slug = path.join(
      dir.substr(dir.indexOf("content") + 7),
      "/",
      page.name.replace(/.md$/, "")
    );

    if (!indexData) {
      return;
    }
    let currentSection = {
      title: pageData.title,
      slug,
      titleSlug: titleSlug.concat([indexData.title, pageData.title]),
    };
    let currentContent = [];

    transform.children.forEach((c, i) => {
      if (
        (currentSection && c.name === "p") ||
        (currentSection && c.name === "ul") ||
        (currentSection && c.name === "ol") ||
        (currentSection && c.name === "pre") ||
        (currentSection && c.name === "table") ||
        (currentSection && c.name === "blockquote")
      ) {
        currentContent.push(c);
      } else if (c.name === "h1" || c.name === "h2" || c.name === "h3") {
        if (currentContent) {
          currentSection.content = markdoc.renderers.html(currentContent);
          index[currentSection.slug] = currentSection;
        }
        currentSection = {
          title: markdoc.renderers.html(c.children),
          base: page.name,
          slug: c.attributes?.id ? `${slug}#${c.attributes.id}` : slug,
          titleSlug: titleSlug.concat([indexData.title, pageData.title]),
        };
        currentContent = [];
      } else if (c.name === "h4" || c.name === "h5" || c.name === "h6") {
        if (currentContent) {
          currentSection.content = markdoc.renderers.html(currentContent);
          index[currentSection.slug] = currentSection;
        }
        currentSection = null;
        currentContent = null;
      }
    });
    if (currentSection && !index[currentSection.slug]) {
      currentSection.content = markdoc.renderers.html(currentContent);
      index[currentSection.slug] = currentSection;
    }
  });

  Object.fromEntries(
    subdirs.map((subdir) => [
      subdir.name,
      buildSearchIndex(
        path.join(dir, subdir.name),
        indexData ? titleSlug.concat([indexData.title]) : []
      ),
    ])
  );
}

buildSearchIndex(path.join(process.cwd(), "content"));

const fileContents = `export const index = ${JSON.stringify(index)}`;

try {
  fs.readdirSync("cache");
} catch (err) {
  fs.mkdirSync("cache");
}

fs.writeFile("cache/tooltip.js", fileContents, function (err) {
  if (err) return console.error(err);
  console.log("Tooltip index created.");
});
