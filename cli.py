import argparse
import sys
from pathlib import Path
from code_refactor.converter import Python2to3Converter
from code_refactor.utils import get_python_files, create_backup, write_converted_file

def main():
    parser = argparse.ArgumentParser(
        description='Convert Python 2 code to Python 3 syntax'
    )
    parser.add_argument(
        'path',
        help='Path to Python file or directory to convert'
    )
    parser.add_argument(
        '--backup',
        action='store_true',
        help='Create backup files before conversion'
    )
    parser.add_argument(
        '--recursive',
        action='store_true',
        help='Recursively convert files in directories'
    )

    args = parser.parse_args()
    path = Path(args.path)
    converter = Python2to3Converter()

    if path.is_file():
        files_to_convert = [path]
    elif path.is_dir() and args.recursive:
        files_to_convert = get_python_files(path)
    elif path.is_dir():
        print("Error: Use --recursive to convert directories")
        sys.exit(1)
    else:
        print(f"Error: Path {path} does not exist")
        sys.exit(1)

    for file_path in files_to_convert:
        try:
            print(f"Converting {file_path}...")
            if args.backup:
                backup_path = create_backup(file_path)
                print(f"Backup created at {backup_path}")

            converted_code = converter.convert_file(file_path)
            write_converted_file(file_path, converted_code)
            print(f"Successfully converted {file_path}")

        except Exception as e:
            print(f"Error converting {file_path}: {e}")
            if args.backup:
                backup_path.rename(file_path)  # Restore from backup
            continue

if __name__ == '__main__':
    main() 