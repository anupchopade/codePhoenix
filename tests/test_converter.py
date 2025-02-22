import unittest
from pathlib import Path
from code_refactor.converter import Python2to3Converter

class TestPython2to3Converter(unittest.TestCase):
    def setUp(self):
        self.converter = Python2to3Converter()
        self.test_files_dir = Path(__file__).parent / 'test_files'
        self.test_files_dir.mkdir(exist_ok=True)

    def test_print_statement_conversion(self):
        py2_code = 'print "Hello, World!"'
        expected_py3 = 'print("Hello, World!")\n'
        result = self.converter.convert_source(py2_code)
        self.assertEqual(result, expected_py3)

    def test_division_conversion(self):
        py2_code = 'result = 10 / 3'
        expected_py3 = 'result = 10 / 3\n'
        result = self.converter.convert_source(py2_code)
        self.assertEqual(result, expected_py3)

    def test_except_clause_conversion(self):
        py2_code = 'try:\n    1/0\nexcept Exception, e:\n    print e'
        expected_py3 = 'try:\n    1 / 0\nexcept Exception as e:\n    print(e)\n'
        result = self.converter.convert_source(py2_code)
        self.assertEqual(result, expected_py3)

if __name__ == '__main__':
    unittest.main() 