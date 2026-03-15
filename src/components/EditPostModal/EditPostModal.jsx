import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import { FaImage } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function EditPostModal({ post }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [previewImage, setPreviewImage] = useState(post?.image || null);

  const textInput = useRef(null);
  const imageInput = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setPreviewImage(post?.image || null);
  }, [post]);

  function updatePost(formData) {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post.id}`,
      formData,
      {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      }
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      toast.success("Post Updated Successfully!", {
        closeOnClick: true,
        autoClose: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getSinglePosts", post.id] });
    },
    onError: () => {
      toast.error("Error Has Occurred!", {
        closeOnClick: true,
        autoClose: 2000,
      });
    },
  });

  function handleImagePreview(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = URL.createObjectURL(file);
    setPreviewImage(path);
  }

  function handleRemoveImage() {
    setPreviewImage(null);
    if (imageInput.current) {
      imageInput.current.value = "";
    }
  }

  function handleUpdatePost(onClose) {
    const body = textInput.current?.value?.trim();
    const imageFile = imageInput.current?.files?.[0];

    if (!body && !imageFile && !previewImage) return;

    const formData = new FormData();

    if (body) {
      formData.append("body", body);
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (!previewImage && post.image) {
      formData.append("removeImage", "true");
    }

    mutate(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center justify-between"
      >
        Edit Post
      </button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="rounded-[2rem]">
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-bold text-slate-800">
                Edit Post
              </ModalHeader>

              <ModalBody>
                <textarea
                  ref={textInput}
                  defaultValue={post?.body || ""}
                  className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  placeholder="Update your post"
                />

                {previewImage && (
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      alt="preview"
                      className="max-h-[360px] w-full object-cover"
                      src={previewImage}
                    />
                    <IoIosCloseCircleOutline
                      onClick={handleRemoveImage}
                      className="absolute right-3 top-3 size-8 cursor-pointer rounded-full bg-slate-900 text-white"
                    />
                  </div>
                )}
              </ModalBody>

              <ModalFooter className="flex items-center justify-between">
                <label className="rounded-full bg-slate-100 p-3 transition duration-200 hover:bg-slate-200">
                  <FaImage className="size-5 cursor-pointer text-slate-700" />
                  <input
                    ref={imageInput}
                    type="file"
                    hidden
                    onChange={handleImagePreview}
                  />
                </label>

                <div className="flex items-center gap-3">
                  <Button
                    className="cursor-pointer rounded-xl"
                    color="danger"
                    variant="light"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>

                  <button
                    type="button"
                    className="cursor-pointer rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-2.5 font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                    onClick={() => handleUpdatePost(onClose)}
                    disabled={isPending}
                  >
                    {isPending ? "Updating..." : "Update"}
                  </button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}