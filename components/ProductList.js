import { useState, useEffect } from 'react'
import Product from './Product'

const ProductList = ({ products }) => {
  const [page, setPage] = useState(1)

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
    if (bottom) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  return (
    <div onScroll={handleScroll}>
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const filters = context.query
  const params = new URLSearchParams(filters).toString()
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/devices?page=${1}&${params}`,
    {
      headers: {
        'x-api-key': process.env.API_KEY_SECRET,
      },
    },
  )
  const products = await res.json()

  return {
    props: {
      products,
    },
  }
}

export default ProductList
