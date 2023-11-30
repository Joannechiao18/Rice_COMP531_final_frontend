import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import "./comments.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../reducer/authReducer";
import { addComment, setComments } from "../../actions/postsActions";
import { selectComments } from "../../reducer/postsReducer";
import { selectFollowedUsers } from "../../reducer/followedUsersReducer";
import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";

const BaseButton = styled.button`
  border: none;
  border-radius: 5px;
  padding: 5px 15px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
`;

const CommentButton = styled(BaseButton)`
  color: white;
  background-color: #938eef;
  margin-right: 5px;

  &:hover {
    background-color: #7a75d6;
  }
`;

const ActionButton = styled(BaseButton)`
  color: white;
  background-color: #938eef;
  margin-right: 5px;

  &:hover {
    background-color: #7a75d6;
  }
`;

const Comments = ({ articleId }) => {
  // Receive articleId as a prop
  const dispatch = useDispatch();
  const comments = useSelector((state) => selectComments(state, articleId));
  const currentUser = useSelector(selectUser);
  const [inputValue, setInputValue] = useState("");
  const followedUsers = useSelector(selectFollowedUsers);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentBody, setEditedCommentBody] = useState("");

  const handleSendClick = async () => {
    if (inputValue.trim() !== "") {
      const newComment = {
        //id: commentId,
        author: currentUser.username,
        body: inputValue,
        avatar: currentUser.avatar,
        // Add any other fields you need
      };

      try {
        const response = await fetch(
          `http://localhost:3000/articles/${articleId}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            //...newComment,
            body: JSON.stringify({
              comment: newComment,
              //text: inputValue,
              articleId: articleId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update the comment.");
        }

        const updatedComment = await response.json();

        const retriveLastComment =
          updatedComment.comments[updatedComment.comments.length - 1];

        dispatch(addComment(articleId, retriveLastComment));

        setInputValue("");
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment.customId);
    setEditedCommentBody(comment.body);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditedCommentBody("");
  };

  const handleEditSave = async (commentId) => {
    if (editedCommentBody.trim() !== "") {
      const updatedComment = {
        customId: commentId,
        author: currentUser.username,
        body: editedCommentBody,
        avatar: currentUser.avatar,
      };
      try {
        const response = await fetch(
          `http://localhost:3000/articles/${articleId}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              comment: updatedComment,
              articleId: articleId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update the comment.");
        }

        const updatedComments = await response.json();

        dispatch(setComments(articleId, updatedComments));

        setEditingCommentId(null);
        setEditedCommentBody("");
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    }
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.avatar} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="form-control mr-2"
          style={{ height: "30px", borderRadius: "20px" }}
        />
        <CommentButton onClick={handleSendClick}>Comment</CommentButton>
      </div>
      {comments.map((comment) => (
        <div key={comment.customId} className="comment">
          <img src={comment.avatar} alt="" />
          <div className="info">
            <span>{comment.author}</span>
            {editingCommentId === comment.customId ? (
              <>
                <input
                  type="text"
                  value={editedCommentBody}
                  onChange={(e) => setEditedCommentBody(e.target.value)}
                  className="form-control mr-2"
                  style={{ height: "30px", borderRadius: "20px" }}
                />
              </>
            ) : (
              <p>{comment.body}</p>
            )}
          </div>
          <div className="actions">
            {editingCommentId === comment.customId ? (
              <>
                <ActionButton onClick={() => handleEditSave(comment.customId)}>
                  Save
                </ActionButton>
                <ActionButton onClick={handleEditCancel}>Cancel</ActionButton>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <span className="date">
                  {formatDistanceToNow(new Date(comment.date), {
                    addSuffix: true,
                  })}
                </span>
                <EditIcon
                  onClick={() => handleEdit(comment)}
                  style={{ cursor: "pointer", marginTop: "5px" }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
