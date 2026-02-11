import { Link } from "react-router-dom"

const HootList = ({ hoots = [] }) => {
  if (!hoots.length) {
    return <p>No hoots yet.</p>
  }

  return (
    <main>
      {hoots.map((hoot) => (
        <article key={hoot.id}>
          <Link to={`/hoots/${hoot.id}`}>
            <h2>{hoot.title}</h2>
          </Link>

          <p>
            Posted by {hoot.author_username} on{" "}
            {new Date(hoot.created_at).toLocaleDateString()}
          </p>

          <p>{hoot.content}</p>
        </article>
      ))}
    </main>
  )
}

export default HootList


