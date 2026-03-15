import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../Loader/Loader'
import { useQuery } from '@tanstack/react-query'
import PostCard from './../PostCard/PostCard';

export default function PostDetails() {
  const { id } = useParams()

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    })
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getSinglePosts", id],
    queryFn: getPostDetails,
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
      <div className="space-y-6">
        <PostCard post={data?.data.data.post} isPostDetails={true} />
      </div>
    </>
  )
}