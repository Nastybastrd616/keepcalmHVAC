try:
    from continue.tools import register_tool
except ImportError:
    def register_tool(func):
        return func

@register_tool
def hello_world():
    """Returns a hello message."""
    return "Hello from custom tool!"
