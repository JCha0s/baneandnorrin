"use client";

import { useState, useEffect } from "react";
import { submitArticle, deleteArticle, getArticles } from "./action";
import Script from "next/script";

// This defines what an article looks like so the errors go away
interface IArticle {
  _id: string;
  title: string;
  author: string;
  category: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); 
  const [articles, setArticles] = useState<IArticle[]>([]);

  const SECRET_PASSWORD = "sahlmas123"; 

  // Load articles from the database
  async function loadArticles() {
    const data = await getArticles();
    setArticles(data);
  }

  // Fetch articles once logged in
  useEffect(() => {
    if (isAuthorized) {
      loadArticles();
    }
  }, [isAuthorized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) setIsAuthorized(true);
    else alert("Incorrect Credentials");
  };

  const openWidget = () => {
    // @ts-ignore
    if (window.cloudinary) {
      // @ts-ignore
      const widget = window.cloudinary.createUploadWidget(
        { cloudName: "dbaolruav", uploadPreset: "bane_uploads", sources: ["local"], multiple: false },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            setImageUrl(result.info.secure_url);
          }
        }
      );
      widget.open();
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] p-4 text-black">
        <div className="max-w-md w-full border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-black pb-2">Editorial Access</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-2 border-black p-3 bg-white" placeholder="••••••••" />
            <button type="submit" className="bg-black text-white py-3 font-bold border-2 border-black uppercase tracking-widest">Verify</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12 text-black font-sans">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="afterInteractive" />
      
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        {/* SECTION 1: CREATE NEW ARTICLE */}
        <div className="bg-white border-2 border-black p-6 md:p-10 shadow-sm">
          <h1 className="text-3xl font-black mb-8 border-b-2 border-black pb-2 uppercase tracking-tighter">Publish New Story</h1>
          <form action={submitArticle} className="flex flex-col gap-6">
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <div className="grid grid-cols-2 gap-6">
              <input name="title" required placeholder="Title" className="border-2 border-black p-3" />
              <input name="author" required placeholder="Author" className="border-2 border-black p-3" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <input name="category" required placeholder="Category" className="border-2 border-black p-3" />
              <input name="date" type="date" className="border-2 border-black p-3" />
            </div>
            <textarea name="standfirst" rows={2} required placeholder="Standfirst (Italic intro)" className="border-2 border-black p-3 italic" />
            <textarea name="content" rows={10} required placeholder="Article Content..." className="border-2 border-black p-3" />
            <div className="border-2 border-dashed border-black p-6 text-center">
              {imageUrl ? (
                <div className="flex flex-col items-center">
                  <img src={imageUrl} alt="Preview" className="h-32 w-auto mb-2 border border-black" />
                  <button type="button" onClick={() => setImageUrl("")} className="text-[10px] font-bold text-red-600 uppercase underline">Remove Image</button>
                </div>
              ) : (
                <button type="button" onClick={openWidget} className="text-[10px] font-bold uppercase tracking-widest border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition">Upload Featured Image</button>
              )}
            </div>
            <button type="submit" className="bg-black text-white py-4 font-bold uppercase tracking-[0.2em] border-2 border-black active:translate-y-1">Publish to Bane & Norrin</button>
          </form>
        </div>

        {/* SECTION 2: MANAGE EXISTING ARTICLES */}
        <div className="bg-white border-2 border-black p-6 md:p-10 shadow-sm">
          <h2 className="text-xl font-black uppercase tracking-tighter border-b-2 border-black pb-2 mb-6">Live Archive Manager</h2>
          <div className="space-y-4">
            {articles.length === 0 ? (
              <p className="text-xs italic text-gray-400">The newsroom is currently empty.</p>
            ) : (
              articles.map((art) => (
                <div key={art._id} className="border border-black/10 p-4 flex justify-between items-center bg-[#fafafa]">
                  <div>
                    <p className="font-bold text-sm uppercase tracking-tight leading-none">{art.title}</p>
                    <p className="text-[9px] text-gray-500 uppercase mt-1 tracking-widest">{art.author} • {art.category}</p>
                  </div>
                  <button 
                    onClick={async () => {
                      if(confirm("Delete this article forever?")) {
                        await deleteArticle(art._id);
                        await loadArticles(); 
                      }
                    }}
                    className="text-[10px] font-bold uppercase text-red-600 border border-red-600 px-3 py-1 hover:bg-red-600 hover:text-white transition"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
