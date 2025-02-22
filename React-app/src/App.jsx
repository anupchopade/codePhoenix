import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Steps from "./components/Steps";
import JavaScriptRefactor from "./pages/JavaScriptRefactor";
import PythonRefactor from "./pages/PythonRefactor";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Steps />
                <Features />
              </>
            }
          />
          <Route path="/javascript" element={<JavaScriptRefactor />} />
          <Route path="/python" element={<PythonRefactor />} />
        </Routes>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "#fff",
        }}
      />
    </Router>
  );
}

export default App;
