import React from 'react'
import '../components/Author/formstyle.css';
import image1 from '../assests/wall.jpg'
import image2 from '../assests/ebook-bg1.jpg'
import image3 from '../assests/ebook_bg.jpg'
import img1 from '../assests/img1.png'
import MultipleSelectChip from './Author/MultipleSelectChip';
const Home = () => {
  return (
    <div className='Home-css' style={{color:'#7431f9',textAlign:'center',fontFamily:'cursive'}}>
      <div
  id="carouselExampleAutoplaying"
  className="carousel slide"
  data-bs-ride="carousel"
>
  <div className="carousel-inner">
  <div className="carousel-item active">
      <img src={img1} height='600px' className="d-block w-100" alt="..." />
    </div>
    <div className="carousel-item active">
      <img src={image1} height='600px' className="d-block w-100" alt="..." />
    </div>
    <div className="carousel-item">
      <img src={image2} height='600px' className="d-block w-100" alt="..." />
    </div>
    <div className="carousel-item">
      <img src={image3} height='600px' className="d-block w-100" alt="..." />
    </div>
  </div>
  <button
    className="carousel-control-prev"
    type="button"
    data-bs-target="#carouselExampleAutoplaying"
    data-bs-slide="prev"
  >
    <span className="carousel-control-prev-icon" aria-hidden="true" />
    <span className="visually-hidden">Previous</span>
  </button>
  <button
    className="carousel-control-next"
    type="button"
    data-bs-target="#carouselExampleAutoplaying"
    data-bs-slide="next"
  >
    <span className="carousel-control-next-icon" aria-hidden="true" />
    <span className="visually-hidden">Next</span>
  </button>


    
    </div>
    </div>
  )
}

export default Home
