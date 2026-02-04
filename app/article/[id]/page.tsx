import React from 'react';
import Link from 'next/link';
import { connectToDatabase } from "@/lib/db";
import Article from "@/models/article";
import { notFound } from "next/navigation";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const post = await Article.findById(id);

  if (!post) notFound();

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(post.publishedAt));

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-serif selection:bg-black selection:text-white">
      {/* Top Navigation / Close Button */}
      <nav className="max-w-7xl mx-auto p-6 md:p-8 flex justify-end">
        <Link href="/" className="text-3xl hover:rotate-90 transition-transform duration-300">
          ✕
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        {/* Header Section */}
        <header className="mb-12">
          <span className="text-red-700 font-sans font-bold uppercase text-xs tracking-[0.2em]">
            {post.category}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mt-4 mb-10 tracking-tighter">
            {post.title}
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-y border-black/10 py-4 font-sans uppercase tracking-widest text-[10px] font-bold">
            <div>
              <p className="text-black">BY {post.author}</p>
              <p className="text-gray-400 italic lowercase font-normal mt-0.5 italic">Contributor</p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="text-black">{formattedDate}</p>
              <p className="text-gray-400 font-normal mt-0.5">BANE & NORRIN DIGITAL</p>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="prose prose-lg max-w-none">
          {/* THE DROP CAP: This applies to the very first letter of the content */}
          <div className="text-xl md:text-2xl leading-[1.8] text-gray-800 first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8] first-letter:text-black whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </main>
    </div>
  );
}
