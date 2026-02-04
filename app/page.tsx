import React from 'react';
import Link from 'next/link';
import { connectToDatabase } from "@/lib/db";
import Article from "@/models/article";

export default async function Home() {
  // 1. Connect to MongoDB
  await connectToDatabase();
  
  // 2. Fetch real articles from the database
  const articles = await Article.find().sort({ publishedAt: -1 });

  const liveDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  }).format(new Date()).toUpperCase();

  const formatDate = (date: any) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    }).format(new Date(date));
  };

  // Logic to find the most recent image in the list to keep the featured box full
  const featuredImage = articles.find(a => a.imageUrl && a.imageUrl.trim() !== "")?.imageUrl;

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-serif p-4 md:p-8">
      
      {/* --- HEADER SECTION --- */}
      <header className="max-w-7xl mx-auto border-b-2 border-black pb-4">
        <div className="relative flex justify-center items-end min-h-[60px] md:min-h-[120px]">
          
          <div className="absolute left-0 bottom-1 hidden lg:block text-[10px] font-sans font-bold uppercase tracking-widest leading-tight">
            <p>London Edition • Issue 001</p>
            <p>Complimentary Copy</p>
          </div>

          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-8xl font-black tracking-tighter mb-[-4px] md:mb-[-8px] whitespace-nowrap transition-all duration-300">
              BANE & NORRIN
            </h1>
          </div>

          <div className="absolute right-0 bottom-1 hidden lg:block text-right text-[10px] font-sans font-bold uppercase tracking-widest leading-tight">
            <p>Est. 2025</p>
            <p>Digital Medical Press</p>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-black mt-4 md:mt-6 py-2 text-[9px] md:text-[11px] font-sans font-bold uppercase tracking-widest">
          <div className="text-left">London, UK</div>
          <div className="text-center">{liveDate}</div>
          <div className="text-right uppercase">Med Perspectives from Healthcare Students</div>
        </div>
      </header>

      {/* --- MAIN FEATURE SECTION --- */}
      <main className="max-w-7xl mx-auto mt-12">
        {articles.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-300">
            <p className="italic text-gray-400 font-sans uppercase tracking-widest">No articles published yet.</p>
            <p className="text-sm text-gray-500 mt-2 font-sans">Visit <span className="font-bold">/admin</span> to create your first story.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-300 pb-12">
              <div className="md:col-span-2">
                <span className="text-red-700 font-sans font-bold uppercase text-sm tracking-tight">
                  {articles[0].category}
                </span>
                <Link href={`/article/${articles[0]._id}`}>
                  <h2 className="text-5xl md:text-6xl font-bold leading-[1.1] mt-2 mb-6 tracking-tighter hover:underline cursor-pointer transition-all">
                    {articles[0].title}
                  </h2>
                </Link>
                <p className="text-xl italic text-gray-700 leading-relaxed mb-6 font-medium">
                  {articles[0].bio}
                </p>
                <div className="flex items-center text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">
                  <span>{articles[0].author}</span>
                  <span className="mx-4 text-gray-300">—</span>
                  <span>{formatDate(articles[0].publishedAt)}</span>
                </div>
              </div>

              {/* FEATURED IMAGE BOX: Uses the fallback logic */}
              <div className="bg-[#eeeeee] border border-gray-200 flex items-center justify-center min-h-[350px] overflow-hidden">
                {featuredImage ? (
                  <img 
                    src={featuredImage} 
                    alt="Featured article visual" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-gray-400 italic font-sans text-sm tracking-widest">
                    [ No Image Available ]
                  </span>
                )}
              </div>
            </div>

            {/* --- SECONDARY ARTICLES GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 mb-20">
              {articles.slice(1).map((post: any) => (
                <div key={post._id.toString()} className="border-l border-gray-200 pl-6 flex flex-col justify-between">
                  <div>
                    <span className="text-gray-500 font-sans font-bold uppercase text-[10px] tracking-widest">
                      {post.category}
                    </span>
                    <Link href={`/article/${post._id}`}>
                      <h3 className="text-2xl font-bold mt-2 mb-3 tracking-tight hover:underline cursor-pointer">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                      {post.bio}
                    </p>
                  </div>
                  <div className="flex justify-between text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">
                    <span>{post.author}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
