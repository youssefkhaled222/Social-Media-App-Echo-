import { CardFooter, CardHeader } from '@heroui/react';
import React from 'react';

const PLACEHOLDER_IMAGE = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

export default function Comment({ comment }) {
  if (!comment) return null;

  return (
    <>
      <CardFooter className="px-4 pb-4 pt-0">
        <div className="w-full rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <CardHeader className="flex items-start gap-3 p-0">
            <img
              alt="comment creator"
              height={40}
              src={comment.commentCreator?.photo || PLACEHOLDER_IMAGE}
              width={40}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow"
              onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
            />

            <div className="flex flex-1 flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-bold text-slate-800">
                  {comment.commentCreator?.name || "Unknown User"}
                </p>
                <p className="text-xs text-slate-400">{comment.createdAt}</p>
              </div>

              {comment.content && (
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {comment.content}
                </p>
              )}

              {comment.image && (
                <img
                  src={comment.image}
                  alt="comment"
                  className="mt-3 max-h-72 rounded-2xl object-cover ring-1 ring-slate-200"
                />
              )}
            </div>
          </CardHeader>
        </div>
      </CardFooter>
    </>
  );
}