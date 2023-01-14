import React from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
const GoToTop = () => {

  const gotop=()=>{
    window.scrollTo({left:0,top:0,behaviour:"smooth"})
  }
  return (
    <div>
      <button
      style={{
        position: "fixed",
        bottom: "5rem",
        right: "5rem",
        zIndex: "999",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius:"45%"
      }}
      onClick={gotop}
      >
        <ArrowUpwardIcon/>
      </button>
    </div>
  )
}

export default GoToTop
