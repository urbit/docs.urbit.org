import os
import re
import toml
from pathlib import Path
from collections import defaultdict

def extract_title_and_weight(md_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    front_matter_match = re.search(r'^\+{3,}\s*\n(.*?)\n^\+{3,}', content, re.DOTALL | re.MULTILINE)
    if not front_matter_match:
        return None, None

    front_matter = front_matter_match.group(1)

    try:
        parsed = toml.loads(front_matter)
        title = parsed.get("title")
        weight = parsed.get("weight", 9999)
        return title, weight
    except toml.TomlDecodeError:
        return None, None

def collect_markdown_files(root):
    summary_structure = defaultdict(lambda: {"readme": None, "children": []})

    for md_file in Path(root).rglob("*.md"):
        if "node_modules" in md_file.parts or md_file.name.lower() == "summary.md":
            continue

        rel_path = md_file.relative_to(root).resolve()
        title, weight = extract_title_and_weight(md_file)
        if not title:
            continue

        parent = rel_path.parent
        entry = (weight, title, str(rel_path.relative_to(Path(root)).as_posix()))

        if md_file.name.lower() == "readme.md":
            summary_structure[parent]["readme"] = entry
        else:
            summary_structure[parent]["children"].append(entry)

    return summary_structure

def build_summary_block(path, summary_structure, visited):
    if path in visited:
        return []
    visited.add(path)

    block = []
    if path not in summary_structure:
        return block

    entry = summary_structure[path]
    if entry["readme"]:
        weight, title, link = entry["readme"]
        block.append(f"* [{title} (weight={weight})]({link})")

    children = sorted(entry["children"], key=lambda x: (x[0], x[1].lower()))
    for weight, title, link in children:
        block.append(f"    * [{title} (weight={weight})]({link})")

    subdirs = sorted(
        [p for p in summary_structure if p.parent == path and p != path],
        key=lambda p: (
            (summary_structure[p]["readme"][0], summary_structure[p]["readme"][1].lower())
            if summary_structure[p]["readme"] else (9999, "")
        )
    )
    for subdir in subdirs:
        sub_block = build_summary_block(subdir, summary_structure, visited)
        if sub_block:
            block.extend(["    " + line for line in sub_block])

    return block

def generate_summary(root_dir):
    root_path = Path(root_dir).resolve()
    summary_structure = collect_markdown_files(root_path)

    top_level_dirs = sorted(
        {p for p in summary_structure if p.parent == root_path},
        key=lambda p: (
            (summary_structure[p]["readme"][0], summary_structure[p]["readme"][1].lower())
            if summary_structure[p]["readme"] else (9999, "")
        )
    )

    summary_lines = ["# Summary\n"]
    visited = set()
    for root in top_level_dirs:
        summary_lines.extend(build_summary_block(root, summary_structure, visited))

    summary_path = root_path / "SUMMARY.md"
    with open(summary_path, "w", encoding="utf-8") as f:
        f.write("\n".join(summary_lines))

if __name__ == "__main__":
    generate_summary(".")
