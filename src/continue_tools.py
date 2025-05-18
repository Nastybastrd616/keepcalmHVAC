try:
    from continue.tools import register_tool
except ImportError:
    def register_tool(func):
        return func

import os
import glob
import subprocess

@register_tool
def search_products(query: str, category: str = None, max_price: float = None):
    """
    Search products in catalog based on criteria
    Args:
        query: Search terms
        category: Product category filter
        max_price: Maximum price filter
    Returns:
        Search results (dummy data for demo)
    """
    # Replace this with your actual product search logic
    products = [
        {"name": "Dell Mouse", "category": "electronics", "price": 25},
        {"name": "Dell Keyboard", "category": "electronics", "price": 45},
        {"name": "Dell Monitor", "category": "electronics", "price": 120},
    ]
    results = [
        p for p in products
        if query.lower() in p["name"].lower()
        and (category is None or p["category"] == category)
        and (max_price is None or p["price"] <= max_price)
    ]
    return results

@register_tool
def builtin_read_file(file_path: str):
    """Read the contents of a file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

@register_tool
def builtin_edit_existing_file(file_path: str, new_content: str):
    """Overwrite a file with new content."""
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return f"File {file_path} updated."

@register_tool
def builtin_create_new_file(file_path: str, content: str = ""):
    """Create a new file with optional content."""
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    return f"File {file_path} created."

@register_tool
def builtin_run_terminal_command(command: str):
    """Run a shell command and return its output."""
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    return result.stdout + result.stderr

@register_tool
def builtin_grep_search(query: str, include_pattern: str = "**/*"):
    """Search for a string in files matching a glob pattern."""
    matches = []
    for file in glob.glob(include_pattern, recursive=True):
        if os.path.isfile(file):
            with open(file, 'r', encoding='utf-8', errors='ignore') as f:
                for i, line in enumerate(f):
                    if query in line:
                        matches.append({"file": file, "line": i+1, "content": line.strip()})
    return matches

@register_tool
def builtin_file_glob_search(pattern: str):
    """Return a list of files matching a glob pattern."""
    return glob.glob(pattern, recursive=True)

@register_tool
def builtin_search_web(query: str):
    """Stub for web search (not implemented)."""
    return f"Web search for: {query} (not implemented)"

@register_tool
def builtin_view_diff(file_path: str):
    """Show git diff for a file."""
    result = subprocess.run(f'git diff {file_path}', shell=True, capture_output=True, text=True)
    return result.stdout

@register_tool
def builtin_read_currently_open_file(file_path: str):
    """Read the contents of a currently open file (same as read_file)."""
    return builtin_read_file(file_path)

@register_tool
def builtin_ls(directory: str = "."):
    """List files and directories in a directory."""
    return os.listdir(directory)

@register_tool
def builtin_create_rule_block(rule: str):
    """Stub for creating a rule block (not implemented)."""
    return f"Rule block created: {rule} (not implemented)"
