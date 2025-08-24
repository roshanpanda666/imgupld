import React from 'react'
import ImageUploader from './components/imgup'
import Nav from './components/nav'



const page = () => {
  return (
    <div>
      <Nav></Nav>
      home page

      <div>
        <ImageUploader></ImageUploader>
      </div>
    </div>
  )
}

export default page
