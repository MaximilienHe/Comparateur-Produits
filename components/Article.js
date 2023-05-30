import React, { useState, useEffect } from 'react'
import styles from './Article.module.css'

const Article = ({ article }) => {
  const [post, setPost] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(
        `https://droidsoft.fr/wp-json/wp/v2/posts/${article.id}`,
        {
          headers: {
            'x-api-key': process.env.API_KEY_SECRET,
          },
        }
      )
      const data = await response.json()
      setPost(data)
    }
    fetchPost()
  }, [article.id])
  

  if (!post) {
    return <div>Chargement de l&apos;article ...</div>
  }

  const formattedDate = new Date(post.date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  }
  const truncateDescription = (description, maxLength = 100) => {
    const decodedDescription = decodeHtml(description)
    return decodedDescription.length > maxLength
      ? `${decodedDescription.slice(0, maxLength)}...`
      : decodedDescription
  }

  const tags = post.yoast_head_json.schema['@graph'][0].articleSection.map(
    (tag, index) => (
      <span key={index} className={styles.tag}>
        {tag.toUpperCase()}
      </span>
    ),
  )

  return (
    <div className={styles.article}>
      <a href={post.guid.rendered}>
        <div className={styles.imageContainer}>
          <img
            src={post.yoast_head_json.og_image[0].url}
            alt={post.title.rendered}
          />
          <div className={styles.overlay}>
            <div className={styles.tagsContainer}>{tags}</div>
          </div>
        </div>
      </a>
      <a href={post.guid.rendered}>
        <h2 className={styles.title}>{decodeHtml(post.title.rendered)}</h2>
      </a>
      <a href={post.guid.rendered}>
        <div
          dangerouslySetInnerHTML={{
            __html: truncateDescription(post.excerpt.rendered),
          }}
        />
      </a>
      <a href={post.guid.rendered}>
        <p className={styles.ArticleDetails}>
          Par <b>{post.yoast_head_json.author}</b> | {formattedDate}
        </p>
      </a>
    </div>
  )
}

export default Article
