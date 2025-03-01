import React from 'react'
import NewsList from './components/NewsList';

const Home = () => {
  return (
    <main className='max-w-3xl mx-auto mt-10'>
      <h1 className="text-3xl font-bold text-center">📰 AI News Assistant</h1>
      <NewsList />
    </main>
  )
}

export default Home;