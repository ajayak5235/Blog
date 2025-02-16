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
    const regexMap = [
        { regex: /###\s*(.*?)(\n|$)/g, replacement: "<h3>$1</h3>\n" }, // Convert "### Heading" to <h3>
        { regex: /##\s*(.*?)(\n|$)/g, replacement: "<h2>$1</h2>\n" }, // Convert "## Heading" to <h2>
        { regex: /#\s*(.*?)(\n|$)/g, replacement: "<h1>$1</h1>\n" }, // Convert "# Heading" to <h1>
        { regex: /\*\*(.*?)\*\*/g, replacement: "<strong>$1</strong>" }, // Convert **bold** to <strong>
        { regex: /\*(.*?)\*/g, replacement: "<em>$1</em>" }, // Convert *italic* to <em>
        { regex: /(?:\r?\n){2,}/g, replacement: "</p>\n<p>" }, // Convert multiple newlines to paragraph breaks
        { regex: /\|\|\s*/g, replacement: "<br>" }, // Convert "||" to <br>

        // Numbered list handling
        { regex: /\n(\d+\.)\s*(.*?)(?=\n\d+\.|\n|$)/g, replacement: "<li>$1 $2</li>" }, 
        { regex: /(<li>\d+\..*?<\/li>)+/gs, replacement: "<ol>$&</ol>" }, 

        // Unordered list handling
        { regex: /\n\*\s*(.*?)(?=\n\*|\n|$)/g, replacement: "<li>$1</li>" }, 
        { regex: /(<li>.*?<\/li>)+/gs, replacement: "<ul>$&</ul>" }, 

        // Code block formatting
        { regex: /```javascript\s*([\s\S]*?)\s*```/g, replacement: '<pre><code class="language-javascript">$1</code></pre>' }
    ];

    // Wrap the entire text in a <p> tag if it's not already wrapped
    let formattedText = regexMap.reduce((text, { regex, replacement }) => {
        return text.replace(regex, replacement);
    }, text);

    if (!formattedText.startsWith("<p>")) {
        formattedText = `<p>${formattedText}</p>`;
    }

    return formattedText.trim();
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
