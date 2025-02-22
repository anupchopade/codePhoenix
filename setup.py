from setuptools import setup, find_packages

setup(
    name="code-refactor-cli",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "astor>=0.8.1",
    ],
    entry_points={
        'console_scripts': [
            'py2to3=cli:main',
        ],
    },
    author="Your Name",
    author_email="your.email@example.com",
    description="A Python 2 to Python 3 code converter",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/code-refactor-cli",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.6",
) 