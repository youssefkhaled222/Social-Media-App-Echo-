import {
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@heroui/react';
import React, { useRef, useState, useContext } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaImage } from "react-icons/fa";
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

const PLACEHOLDER_IMAGE = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

export default function PostCreation() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isUploaded, setIsUploaded] = useState(null);

  const queryClient = useQueryClient();
  const { userData } = useContext(AuthContext);

  const textInput = useRef(null);
  const imageInput = useRef(null);

  function createPost(formData) {
    return axios.post(
      `https://route-posts.routemisr.com/posts`,
      formData,
      {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      }
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      toast.success("Post Created Successfully!", {
        closeOnClick: true,
        autoClose: 2000,
      });
      if (textInput.current) textInput.current.value = "";
      if (imageInput.current) imageInput.current.value = "";

      setIsUploaded(null);
    },
    onError: () => {
      toast.error("Error Has Occurred!", {
        closeOnClick: true,
        autoClose: 2000,
      });
    }
  });

  function handleImagePreview(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const path = URL.createObjectURL(file);
    setIsUploaded(path);
  }

  function handleRemoveImage() {
    setIsUploaded(null);

    if (imageInput.current) {
      imageInput.current.value = "";
    }
  }

  function handleCreatePost(onClose) {
    const body = textInput.current?.value?.trim();
    const imageFile = imageInput.current?.files?.[0];

    if (!body && !imageFile) return;

    const formData = new FormData();

    if (body) {
      formData.append("body", body);
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    mutate(formData, {
      onSuccess: () => {
        onClose();
      }
    });
  }

  return (
    <>
      <div className="mx-auto mb-6 max-w-2xl rounded-[2rem] bg-white/80 p-4 shadow-xl ring-1 ring-slate-200 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Avatar
            isBordered
            size="md"
            src={userData?.photo || PLACEHOLDER_IMAGE}
            name={userData?.name || "User"}
          />

          <input
            onClick={onOpen}
            type="text"
            className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none transition duration-200 hover:bg-slate-50"
            placeholder="What's on your mind..!"
            readOnly
          />
        </div>

        <div className="modal">
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent className="rounded-[2rem]">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-xl font-bold text-slate-800">
                    Create Your Post
                  </ModalHeader>

                  <ModalBody>
                    <textarea
                      ref={textInput}
                      className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                      placeholder="Start Writing"
                    />

                    {isUploaded && (
                      <div className="relative overflow-hidden rounded-2xl">
                        <img
                          alt="preview"
                          className="max-h-[360px] w-full object-cover"
                          src={isUploaded}
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
                        onClick={() => handleCreatePost(onClose)}
                        disabled={isPending}
                      >
                        {isPending ? "Creating..." : "Create"}
                      </button>
                    </div>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
}