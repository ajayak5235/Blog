import { useState } from "react";
import axios from "axios";
import { Wand2, FileText, Share2, ImageIcon, Loader2, Mail, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const formatResponse = (text) => {
    return text
    .replace(/###\s*(.*?)(\n|$)/g, "<h3>$1</h3>") // Convert "### Heading" to <h3>
    .replace(/##\s*(.*?)(\n|$)/g, "<h2>$1</h2>") // Convert "## Heading" to <h2>
    .replace(/#\s*(.*?)(\n|$)/g, "<h1>$1</h1>") // Convert "# Heading" to <h1>
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic text
    .replace(/\"(.*?)\"/g, "&ldquo;$1&rdquo;") // Smart quotes
    .replace(/\n{2,}/g, "</p><p>") // Preserve paragraph spacing
    .replace(/\*\s*(.*?)(\n|$)/g, "<li>$1</li>") // Convert list items
    .replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>") // Wrap list items in <ul>
    .replace(/\|\|\s*/g, "<br>") // Handle custom line breaks
    .trim();
  };

  const handleGenerate = async (type) => {
    setLoading(true);
    try {
      const res = await axios.post("https://ai-backend-mocha.vercel.app/generate", {
        contentType: type,
        prompt: input,
      });

      const cleanedResponse = formatResponse(res.data.content);
      setResponse(cleanedResponse);
    } catch (error) {
      setResponse(error.response?.data?.error || "Error generating content. Try again.");
    }
    setLoading(false);
  };

  const exportContent = () => {
    if (!response) {
      toast.error("No content to export");
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([response.replace(/<[^>]*>/g, "")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `generated-content-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Content exported successfully!");
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        <div className="header">
          <h1 className="title">
            <Wand2 className="icon" />
            AI Creator
          </h1>
          <p className="subtitle">Transform your ideas into engaging content</p>
        </div>

        <div className="content">
          <div className="input-box">
            <textarea
              className="textarea"
              placeholder="Enter a topic or keywords..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="button-group">
              <button onClick={() => handleGenerate("question")} disabled={loading} className="button question-btn">
                <FileText className="btn-icon" />
                Ask a Question
              </button>
              <button onClick={() => handleGenerate("stock")} disabled={loading} className="button stock-btn">
                <FileText className="btn-icon" />
                Stock Advice
              </button>
              <button onClick={() => handleGenerate("blog")} disabled={loading} className="button blog-btn">
                <FileText className="btn-icon" />
                Blog Post
              </button>
              <button onClick={() => handleGenerate("social")} disabled={loading} className="button social-btn">
                <Share2 className="btn-icon" />
                Social Post
              </button>
              <button onClick={() => handleGenerate("image")} disabled={loading} className="button image-btn">
                <ImageIcon className="btn-icon" />
                Image Prompt
              </button>
              <button onClick={() => handleGenerate("article")} disabled={loading} className="button image-article">
                <BookOpen className="btn-icon" />
                Article
              </button>
              <button onClick={() => handleGenerate("email")} disabled={loading} className="button image-email">
                <Mail className="btn-icon" />
                Email
              </button>
              <button onClick={() => handleGenerate("story")} disabled={loading} className="button image-story">
                <FileText className="btn-icon" />
                Story
              </button>
              <button onClick={exportContent} disabled={!response} className="button image-btn">
                <FileText className="btn-icon" />
                Export
              </button>
            </div>
          </div>

          <div className="output-box">
            {loading ? (
              <div className="loading">
                <Loader2 className="loading-icon" />
                <span>Generating content...</span>
              </div>
            ) : (
              <div
                className="prose prose-indigo max-w-none"
                dangerouslySetInnerHTML={{ __html: response || "Your generated content will appear here..." }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
