import React ,{useState} from 'react'
// import Confetti from 'react-confetti'

const PopUps = () => {
    const [showConfetti, setShowConfetti] = useState(false);

  function handleButtonClick() {
    setShowConfetti(true);
  }

  return (
    <div>
      <button
    type="button"
    className="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#staticBackdrop"
  >
    Launch static backdrop modal
  </button>
  {/* Modal */}
  
  <button onClick={handleButtonClick}>Celebrate</button>
      {/* {showConfetti && <Confetti recycle={false} />} */}
    </div>
  )
}

export default PopUps

