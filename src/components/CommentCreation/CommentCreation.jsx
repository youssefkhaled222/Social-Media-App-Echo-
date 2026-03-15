import { Input } from '@heroui/react'
import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';
import { FaComment, FaImage } from "react-icons/fa";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LuLoaderCircle } from "react-icons/lu";
import { toast } from 'react-toastify';

export default function CommentCreation({ postId, queryKey }) {
  const form = useForm({
    defaultValues: {
      body: "",
      image: null
    }
  });

  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = form;

  function createComment(formData) {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: {
          token: localStorage.getItem("userToken"),
        }
      }
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      reset();
      toast.success("Comment Created Successfully!", {
        closeOnClick: true,
        autoClose: 2000,
      });
    },
    onError: () => {
      toast.success("Error Has Occurred!", {
        closeOnClick: true,
        autoClose: 2000,
      });
    }
  });

  function handelCreateComment(values) {
    if (!values.body && !values.image?.[0]) return;

    const formData = new FormData();

    if (values.body) {
      formData.append("content", values.body);
    }

    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    mutate(formData);
  }

  return (
    <div className="mx-auto mb-3 w-[92%] rounded-2xl bg-slate-50/90 p-3 ring-1 ring-slate-200">
      <form onSubmit={handleSubmit(handelCreateComment)}>
        <Input
          {...register("body")}
          labelPlacement="outside"
          placeholder="Say what's on your mind..."
          classNames={{
            inputWrapper: "rounded-2xl border border-slate-200 bg-white shadow-sm",
          }}
          endContent={
            <button
              disabled={isPending}
              type="submit"
              className="cursor-pointer rounded-full p-2 text-slate-700 transition duration-200 hover:bg-slate-100 disabled:cursor-not-allowed"
            >
              {isPending ? <LuLoaderCircle className="animate-spin" /> : <FaComment />}
            </button>
          }
          type="text"
        />

        <div className="mt-3 flex justify-end">
          <label className="cursor-pointer rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:bg-slate-100" htmlFor="image">
            <FaImage className="text-slate-700" />
          </label>
        </div>

        <input {...register("image")} type="file" id="image" hidden />
      </form>
    </div>
  );
}