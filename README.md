# CodePhoenix 🔥

> Transform legacy code into modern excellence with intelligent refactoring and code correction.

CodePhoenix is a powerful web application that helps developers modernize their codebase effortlessly. Just as the phoenix rises from its ashes, we help transform old code into modern, efficient, and maintainable solutions.

![CodePhoenix Banner](public/banner.png)

## ✨ Features

### 🚀 Code Refactoring
- **JavaScript Modernization**: Transform ES5 to modern ES6+ syntax
  - Arrow functions
  - Template literals
  - Destructuring
  - Modern array methods
  - Class syntax
  
- **Python Upgrading**: Convert Python 2.x to 3.x
  - String handling updates
  - Print function syntax
  - Iterator improvements
  - Modern context managers

### 🎯 Code Correction
- **JavaScript Correction**
  - Syntax error detection and fixing
  - ESLint rule compliance
  - Code style optimization
  - Best practices implementation

- **Python Correction**
  - PEP 8 style guide enforcement
  - Syntax validation
  - Common anti-pattern detection
  - Auto-formatting

### ⚡ Real-time Processing
- Instant code analysis
- Live preview of transformations
- Immediate feedback
- Syntax highlighting

## 🛠️ Technology Stack

### Frontend
- React with Vite
- React Router for navigation
- Custom hooks for animations
- Modern CSS with flexbox/grid
- Responsive design

### Backend
- Node.js with Express
- Redis for caching
- Babel for JavaScript transformation
- 2to3 for Python conversion
- ESLint & Prettier for js code formatting
- autopep8 for python code formatting

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Docker and Docker Compose
- Redis
- Python 3.x (for Python transformations)
- autopep8 (run `pip install autopep8` to install)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/codePhoenix.git
   cd codePhoenix
   ```

2. **Frontend Setup**
   ```bash
   # Navigate to React app directory
   cd React-app

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

3. **Backend Setup**
   ```bash
   # Navigate to backend directory
   cd backend

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```
   The API will be available at `http://localhost:5000`

4. **Docker Setup**
   ```bash
   # Build and start containers
   docker-compose up -d

   # Stop containers
   docker-compose down
   ```

### Environment Variables

Create `.env` files in backend directory:



**Backend (.env)**
```env
PORT=5000
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
NODE_ENV=development # development, production
```

## 🌟 Usage

1. **Code Refactoring**
   - Select JavaScript or Python refactoring
   - Paste your legacy code
   - Click "Refactor Code"
   - Review and copy the modernized code

2. **Code Correction**
   - Choose your language
   - Input your code
   - Click "Correct Code"
   - Review fixes and improvements

## 🎨 Features in Detail

### Intelligent Code Analysis
- AST (Abstract Syntax Tree) parsing
- Pattern recognition
- Context-aware transformations
- Best practices implementation

### Modern UI/UX
- Responsive design
- Real-time feedback
- Syntax highlighting
- Error visualization
- Smooth animations

### Performance
- Redis caching
- Efficient code processing
- Optimized transformations
- Quick response times

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Babel](https://babeljs.io/) for JavaScript transformation
- [2to3](https://docs.python.org/3/library/2to3.html) for Python conversion
- [ESLint](https://eslint.org/) for code analysis
- [Prettier](https://prettier.io/) for code formatting
- [autopep8](https://github.com/hhatto/autopep8) for Python code formatting

---

Made with ❤️ 
