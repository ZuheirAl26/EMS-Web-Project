import { useTranslation } from "react-i18next";
import { Button } from "../../../../components";
import { posts } from "../../../landing page/pages/landingData";
import "./BlogSection.scss";

export function BlogSection() {
  const { t } = useTranslation("landing");

  return (
    <section className="blog-section" id="blog">
      <div className="blog-section__shell">
        <div className="blog-section__header">
          <div>
            <p>{t("blog.eyebrow")}</p>
            <h2>{t("blog.title")}</h2>
          </div>
          <Button variant="secondary">{t("blog.viewAll")}</Button>
        </div>
        <div className="blog-section__grid">
          {posts.map((post) => (
            <article className="blog-section__card" key={post.id}>
              <div className="blog-section__media" />
              <div className="blog-section__body">
                <h3>{t(`blog.posts.${post.id}.title`)}</h3>
                <p>{t(`blog.posts.${post.id}.description`)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
