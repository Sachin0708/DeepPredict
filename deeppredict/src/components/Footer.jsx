import React from 'react'
export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="container-grid">
        <div>© {new Date().getFullYear()} DeepPredict — Built for forecasting & analytics</div>
      </div>
    </footer>
  )
}
