import axios from 'axios'
import React from 'react'
import PostCard from '../PostCard/PostCard'
import Loader from '../Loader/Loader';
import { useQuery } from '@tanstack/react-query';
import PostCreation from '../PostCreation/PostCreation';
import { HelmetProvider } from 'react-helmet-async'

export default function Home() {
  function getAllPosts() {
    return axios.get(`https://route-posts.routemisr.com/posts`, {
      params: { sort: "-createdAt" },
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
  });

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-600 shadow-sm">
        {error.message}
      </div>
    )
  }

  return (
    <>
      <HelmetProvider>
        <title>Home</title>
      </HelmetProvider>

      <section className="space-y-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 rounded-3xl bg-white/70 p-5 shadow-lg ring-1 ring-slate-200 backdrop-blur-sm">
            <h1 className="text-left text-3xl font-extrabold tracking-tight text-slate-800">
              Welcome back to Echo
            </h1>
            <p className="mt-2 text-left text-sm text-slate-500">
              Catch up with the latest posts and share what’s on your mind.
            </p>
          </div>
        </div>

        <PostCreation />

        <div className="space-y-6">
          {data?.data.data.posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </>
  )
}