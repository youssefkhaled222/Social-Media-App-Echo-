import { Card, CardHeader, CardBody, CardFooter, Divider, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import Comment from "../Comment/Comment";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CommentCreation from "../CommentCreation/CommentCreation";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import EditPostModal from "../EditPostModal/EditPostModal";

const PLACEHOLDER_IMAGE = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

export default function PostCard({ post, isPostDetails = false }) {
  const { body, image, topComment, commentsCount, createdAt, user, id } = post;
  const { name, photo } = user;

  const { userId: loggedUserId } = useContext(AuthContext)
  const navigate = useNavigate()
  const userId = user._id

  function getPostComments() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    })
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getPostComments", id],
    queryFn: getPostComments
  })

  if (!body && !image) return null;

  function deleteMyPost() {
    axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    })
  }

  const query = useQueryClient()

  const { isPending, mutate } = useMutation({
    mutationFn: deleteMyPost,
    onSuccess: () => {
      toast.success("Post Deleted Successfully!", {
        closeOnClick: true,
        autoClose: 2000,
      });
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      navigate("/")
    },
    onError: () => {
      toast.error("Error Has Occurred", {
        closeOnClick: true,
        autoClose: 2000,
      })
    }
  });

  return (
    <Card className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-white/40 bg-white/85 shadow-xl backdrop-blur-sm transition duration-300 hover:shadow-2xl">
      <CardHeader className="flex justify-between gap-3 px-5 py-4">
        <div className="flex gap-3">
          <img
            alt="user"
            height={44}
            src={photo || PLACEHOLDER_IMAGE}
            width={44}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100 shadow"
            onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
          />
          <div className="flex flex-col">
            <p className="text-base font-bold text-slate-800">{name}</p>
            <p className="text-xs text-slate-400">{createdAt}</p>
          </div>
        </div>

        {loggedUserId === userId && (
          <Dropdown>
            <DropdownTrigger>
              <div className="rounded-full p-2 transition duration-200 hover:bg-slate-100">
                <BsThreeDotsVertical className="cursor-pointer text-slate-600" />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="edit">
  <div className="flex items-center justify-between gap-4">
    <EditPostModal post={post} />
    <FaPen />
  </div>
</DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger">
                <div className="flex items-center justify-between gap-4" onClick={mutate}>
                  Delete Post <FaTrash />
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </CardHeader>

      <Divider />

      <CardBody className="px-5 py-4">
        {body && <p className="mb-4 text-left text-[15px] leading-7 text-slate-700">{body}</p>}
        {image && (
          <img
            src={image}
            alt="Photo"
            className="max-h-[520px] w-full rounded-[1.5rem] object-cover ring-1 ring-slate-200"
          />
        )}
      </CardBody>

      <Divider />

      <CardFooter className="px-5 py-4">
        <div className="flex w-full items-center justify-between text-sm font-semibold text-slate-600">
          <div className="cursor-pointer rounded-xl px-3 py-2 transition duration-200 hover:bg-slate-100 hover:text-sky-600">
            Like
          </div>
          <div className="cursor-pointer rounded-xl px-3 py-2 transition duration-200 hover:bg-slate-100 hover:text-sky-600">
            <Link to={`/postdetails/${id}`}>Comments</Link> ({commentsCount})
          </div>
          <div className="cursor-pointer rounded-xl px-3 py-2 transition duration-200 hover:bg-slate-100 hover:text-sky-600">
            Share
          </div>
        </div>
      </CardFooter>

      <CommentCreation postId={id} queryKey={isPostDetails ? ["getPostComments", id] : ["getAllPosts"]} />

      {isPostDetails === false && topComment && <Comment comment={topComment} />}
      {isPostDetails === true && data?.data.data.comments.map((currentComment) => <Comment key={currentComment._id} comment={currentComment} />)}
    </Card>
  );
}