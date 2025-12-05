import { useEffect, useState } from "react";
import { getPosts } from "../lib/api";
import { Post } from "../types/post";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Blog</h1>

      {posts.map(post => (
        <div key={post.id} className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-600">
            {post.content.substring(0, 120)}...
          </p>
        </div>
      ))}
    </div>
  );
}
