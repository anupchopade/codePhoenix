import os
from pathlib import Path
from typing import List, Union

def get_python_files(directory: Union[str, Path]) -> List[Path]:
    """Recursively find all Python files in a directory."""
    python_files = []
    directory = Path(directory)
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.py'):
                python_files.append(Path(root) / file)
    
    return python_files

def create_backup(file_path: Union[str, Path]) -> Path:
    """Create a backup of the original file."""
    file_path = Path(file_path)
    backup_path = file_path.with_suffix('.py.bak')
    file_path.rename(backup_path)
    return backup_path

def write_converted_file(file_path: Union[str, Path], content: str) -> None:
    """Write the converted content to a file."""
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content) 