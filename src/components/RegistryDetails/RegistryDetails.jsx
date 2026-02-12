import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import * as hootService from "../../services/registryService";
import { UserContext } from "../../contexts/UserContext";

import CommentForm from "../CommentForm/CommentForm";

const HootDetails = ({ handleDeleteHoot }) => {
  const { hootId } = useParams();
  const [hoot, setHoot] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchItem = async () => {
      const itemData = await hootService.show(hootId);
      setHoot(itemData);
    };
    fetchItem();
  }, [hootId]);

  const handleAddComment = async (commentFormData) => {
    try {
      const newComment = await hootService.createComment(hootId, commentFormData);

      // If backend returns full item, adjust. If it returns only the comment, keep this:
      setHoot((prev) => ({
        ...prev,
        comments: prev?.comments ? [newComment, ...prev.comments] : [newComment],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  if (!hoot) return <main>Loading...</main>;

  const isOwner = user && hoot.item_owner_id === user.id;

  return (
    <main>
      <section>
        <header>
          <h1>{hoot.item_name}</h1>

          {hoot.image_url && (
            <img
              src={hoot.image_url}
              width={300}
              alt={hoot.item_name}
              style={{ display: "block", marginTop: "10px" }}
            />
          )}

          <p>
            {`${hoot.owner_username || "Someone"} added this on ${
              hoot.created_at ? new Date(hoot.created_at).toLocaleDateString() : "Unknown date"
            }`}
          </p>

          {isOwner && (
            <>
              <Link to={`/hoots/${hootId}/edit`}>Edit</Link>{" "}
              <button onClick={() => handleDeleteHoot(hootId)}>Delete</button>
            </>
          )}
        </header>

        <p>{hoot.description}</p>
      </section>

      <section>
        <h2>Comments</h2>

        <CommentForm handleAddComment={handleAddComment} />

        {!hoot.comments || hoot.comments.length === 0 ? (
          <p>There are no comments.</p>
        ) : (
          hoot.comments.map((comment) => (
            <article key={comment.comment_id}>
              <header>
                <p>
                  {`${comment.comment_author_username} posted on ${
                    comment.comment_created_at
                      ? new Date(comment.comment_created_at).toLocaleDateString()
                      : "Unknown date"
                  }`}
                </p>
              </header>
              <p>{comment.comment_text}</p>
            </article>
          ))
        )}
      </section>
    </main>
  );
};

export default HootDetails;

