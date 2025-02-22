import ast
import astor
from typing import Union, List, Dict
from pathlib import Path

class Python2to3Converter:
    def __init__(self):
        self.transformations = {
            'print_stmt': self._convert_print,
            'unicode_literal': self._convert_unicode,
            'division': self._convert_division,
            'except_clause': self._convert_except,
        }

    def convert_file(self, file_path: Union[str, Path]) -> str:
        """Convert a Python 2 file to Python 3 syntax."""
        with open(file_path, 'r', encoding='utf-8') as f:
            source = f.read()
        return self.convert_source(source)

    def convert_source(self, source: str) -> str:
        """Convert Python 2 source code to Python 3 syntax."""
        try:
            tree = ast.parse(source)
            modified_tree = self.transform_ast(tree)
            return astor.to_source(modified_tree)
        except SyntaxError as e:
            raise ValueError(f"Invalid Python syntax: {e}")

    def transform_ast(self, tree: ast.AST) -> ast.AST:
        """Transform the AST by applying all conversion rules."""
        for node in ast.walk(tree):
            for transform_type, transform_func in self.transformations.items():
                if isinstance(node, getattr(ast, transform_type, None)):
                    transform_func(node)
        return tree

    def _convert_print(self, node: ast.Print) -> None:
        """Convert print statement to print function."""
        func = ast.Name(id='print', ctx=ast.Load())
        if node.values:
            if len(node.values) == 1:
                args = [node.values[0]]
            else:
                args = [ast.Tuple(elts=node.values, ctx=ast.Load())]
        else:
            args = []
        
        if node.dest:
            keywords = [ast.keyword(arg='file', value=node.dest)]
        else:
            keywords = []

        new_node = ast.Call(
            func=func,
            args=args,
            keywords=keywords
        )
        ast.copy_location(new_node, node)
        ast.fix_missing_locations(new_node)

    def _convert_unicode(self, node: ast.Str) -> None:
        """Convert unicode literals to str."""
        if isinstance(node.s, bytes):
            node.s = node.s.decode('utf-8')

    def _convert_division(self, node: ast.BinOp) -> None:
        """Convert classic division to true division."""
        if isinstance(node.op, ast.Div):
            node.op = ast.TrueDiv()

    def _convert_except(self, node: ast.ExceptHandler) -> None:
        """Convert except clause syntax."""
        if isinstance(node.type, ast.Tuple):
            node.type = node.type.elts[0] 