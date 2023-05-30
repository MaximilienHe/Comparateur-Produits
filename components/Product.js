import Link from 'next/link'

const Product = ({ product }) => {
  const { id, img, title, announced_date } = product

  return (
    <div className="product">
      <div className="product__image">
        <img src={img} alt={title} />
      </div>
      <div className="product__info">
        <h3 className="product__title">{title}</h3>
        <p className="product__date">
          {new Date(announced_date).toLocaleDateString()}
        </p>
        <Link href={`/product/${id}`}>
          <a className="product__button">En savoir plus</a>
        </Link>
      </div>
    </div>
  )
}

export default Product
