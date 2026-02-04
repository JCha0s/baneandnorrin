"use server";

import { connectToDatabase } from "@/lib/db";
import Article from "@/models/article";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitArticle(formData: FormData) {
  await connectToDatabase();

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const category = formData.get("category") as string;
  const bio = formData.get("standfirst") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const dateInput = formData.get("date");

  const articleData: any = {
    title,
    author,
    category,
    bio,
    content,
    publishedAt: dateInput ? new Date(dateInput as string) : new Date(),
  };

  if (imageUrl && imageUrl.trim() !== "") {
    articleData.imageUrl = imageUrl;
  }

  try {
    await Article.create(articleData);
  } catch (error) {
    console.error("Submit failed:", error);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/");
}

export async function deleteArticle(id: string) {
  await connectToDatabase();
  try {
    await Article.findByIdAndDelete(id);
    revalidatePath("/");
    revalidatePath("/admin"); 
  } catch (error) {
    console.error("Delete failed:", error);
  }
}

export async function getArticles() {
  await connectToDatabase();
  // We use .lean() to get a plain JS object, then stringify to clean up the IDs
  const articles = await Article.find().sort({ publishedAt: -1 }).lean();
  return JSON.parse(JSON.stringify(articles)) as any[];
}
