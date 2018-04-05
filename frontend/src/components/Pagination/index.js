import React from 'react'
import { Link } from 'react-router-dom'

const generatePages = (currentPage, numberOfPages, maxNumberOfPagesAroundCurrentPage = 3) => {
  if (numberOfPages < 1) return []
  const firstPage = {
    title: 'First',
    number: 1,
    canBeDisabled: currentPage === 1,
    isCurrent: currentPage === 1
  }

  const lastPage = {
    title: 'Last',
    number: numberOfPages,
    canBeDisabled: currentPage === numberOfPages,
    isCurrent: currentPage === numberOfPages
  }

  const startPage = currentPage > (maxNumberOfPagesAroundCurrentPage + 1) ? currentPage - maxNumberOfPagesAroundCurrentPage : 1
  const pages = []
  const totalPages = currentPage + maxNumberOfPagesAroundCurrentPage


  if (startPage !== 1) {
    pages.push({
      title: '...',
      number: startPage - 1,
      canBeDisabled: true,
      isCurrent: false
    })
  }

  for (let i = startPage; i <= totalPages && i <= numberOfPages; i++) {
    pages.push({
      title: i,
      number: i,
      canBeDisabled: currentPage === i,
      isCurrent: currentPage === i
    })
    if (i === currentPage + maxNumberOfPagesAroundCurrentPage && i < numberOfPages) {
      pages.push({
        title: '...',
        number: i + 1,
        canBeDisabled: true,
        isCurrent: false
      })
    }
  }

  return [firstPage, ...pages, lastPage]
}

const Pagination = ({ perPage, currentPage = 1, totalItems }) => {
  const pages = generatePages(Number(currentPage), Math.floor(totalItems / perPage))

  return (
    <ul className="pagination text-center">
      {pages.map(({ title, number, canBeDisabled, isCurrent }, i) => {
        if (canBeDisabled || isCurrent) return <li key={i} className="disabled"><span>{title}</span></li>
        return <li key={i}><Link to={`/posts/${number}`}>{title}</Link></li>
      })}
    </ul>
  )
}

export default Pagination
