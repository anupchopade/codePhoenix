import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ArrowRight, Code2, Zap, BarChart3, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      title: "Python Conversion",
      description: "Convert Python 2 code to Python 3 with intelligent syntax updates",
      icon: <Code2 className="w-8 h-8 text-purple-500" />
    },
    {
      title: "JavaScript Migration",
      description: "Upgrade legacy JavaScript to modern ES6+ standards",
      icon: <Zap className="w-8 h-8 text-purple-500" />
    },
    {
      title: "Code Analysis",
      description: "Get detailed insights and suggestions for your code",
      icon: <BarChart3 className="w-8 h-8 text-purple-500" />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-purple-900 mb-6 flex items-center justify-center gap-4">
            Code Phoenix <Sparkles className="w-12 h-12 text-purple-500" />
          </h1>
          <p className="text-xl sm:text-2xl text-purple-600 mb-10 max-w-3xl mx-auto">
            Transform Your Legacy Code into Modern Standards
          </p>
          <div className="flex justify-center gap-6">
            <Button 
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 h-12"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 text-lg px-8 h-12"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`transform transition-all duration-300 hover:scale-105 ${
                index === activeFeature 
                  ? 'border-purple-400 bg-purple-50 shadow-lg' 
                  : 'bg-white/80 backdrop-blur-sm'
              }`}
            >
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-2xl text-purple-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-purple-900">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Upload Your Code', 'Select Conversion Type', 'Get Modern Code'].map((step, index) => (
              <Card key={index} className="text-center bg-white/50 backdrop-blur-sm border-purple-200">
                <CardHeader>
                  <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center shadow-md">
                    <span className="text-2xl font-bold text-purple-800">{index + 1}</span>
                  </div>
                  <CardTitle className="text-xl text-purple-800">{step}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {index === 0 
                      ? 'Choose your legacy code file or paste your code directly'
                      : index === 1 
                      ? 'Choose your target language version or framework'
                      : 'Receive your upgraded code with detailed changes'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Coming Soon Section */}
        <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-center text-purple-900">
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['TypeScript', 'Ruby', 'Java', 'PHP'].map((lang) => (
                <Card key={lang} className="bg-purple-50/50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-800 text-center">{lang}</CardTitle>
                    <CardDescription className="text-center">Support</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
