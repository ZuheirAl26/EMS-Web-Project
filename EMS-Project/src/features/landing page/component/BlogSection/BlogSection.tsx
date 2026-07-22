import { Button } from "../../../../components";
import { posts } from "../../../landing page/pages/landingData";
import "./BlogSection.scss";

export function BlogSection() {
  return (
    <section className="blog-section" id="blog">
      <div className="blog-section__shell">
        <div className="blog-section__header">
          <div>
            <p>Blog</p>
            <h2>From the ExhibitorHub Blog</h2>
          </div>
          <Button variant="secondary">View All Posts</Button>
        </div>
        <div className="blog-section__grid">
          {posts.map((post) => (
            <article className="blog-section__card" key={post.title}>
              <div className="blog-section__media" />
              <div className="blog-section__body">
                <h3>{post.title}</h3>
                <p>{post.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
