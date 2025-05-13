import re
import os
from pathlib import Path

# Allowed top-level directories for root-relative links
ALLOWED_ROOTS = {"courses", "glossary", "language", "manual", "system", "tools", "userspace"}

def relativize_links_in_file(md_file, root_path):
    md_file = md_file.resolve()
    md_dir = md_file.parent

    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()

    def replacer(match):
        text = match.group(1)
        link = match.group(2)

        # Only adjust root-relative links (start with "/" but not with // or http:// etc.)
        if not link.startswith('/') or re.match(r'^//|^[a-z]+://', link):
            return match.group(0)

        # Split off any anchor (e.g., #section)
        if '#' in link:
            link_path, anchor = link.split('#', 1)
            anchor = '#' + anchor
        else:
            link_path, anchor = link, ''

        # Only apply to allowed root directories
        first_part = link_path.strip('/').split('/', 1)[0]
        if first_part not in ALLOWED_ROOTS:
            print(f"Skipped link in {md_file}: {link}")
            return match.group(0)

        # Remove leading slash and compute the new relative path
        target_path = (root_path / link_path.lstrip('/')).resolve()
        try:
            rel_path = target_path.relative_to(md_dir)
        except ValueError:
            rel_path = os.path.relpath(target_path, md_dir)

        # Append .md if it's not a directory and doesn't already end in .md
        if not target_path.is_dir() and not str(rel_path).endswith('.md'):
            rel_path = f"{rel_path}.md"

        return f'[{text}]({rel_path}{anchor})'

    fixed_content = re.sub(r'\[([^\]]+)]\((/[^)]+)\)', replacer, content)

    with open(md_file, 'w', encoding='utf-8') as f:
        f.write(fixed_content)


def process_all_markdown_files(root_dir):
    root_path = Path(root_dir).resolve()
    for md_file in root_path.rglob("*.md"):
        if "node_modules" in md_file.parts or md_file.name.lower() == "summary.md":
            continue
        relativize_links_in_file(md_file, root_path)


if __name__ == "__main__":
    process_all_markdown_files(".")

