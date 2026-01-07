import React from 'react'
import { useParams, Link } from 'react-router-dom'

const data = {
  arima: {title:'ARIMA Model', details:'Use ARIMA for stationary time series. Includes notebooks and a sample script.'},
  ecommerce: {title:'E-commerce', details:'Demand forecasting, user segmentation & personalization experiments.'},
  stock: {title:'Stock Prediction', details:'Price forecasting pipelines, feature engineering and backtesting.'},
  realestate: {title:'Real Estate', details:'Hedonic pricing, feature extraction & regional analysis.'}
}

export default function ModelDetail(){
  const { id } = useParams()
  const model = data[id] || {title:'Unknown', details:'No data available.'}

  return (
    <section className="page-section">
      <div className="detail-header">
        <h2>{model.title}</h2>
        <Link to="/models" className="btn btn-outline">Back</Link>
      </div>

      <p className="lead">{model.details}</p>

      <div className="grid-cards">
        <div className="card">Example Notebook</div>
        <div className="card">Sample Dataset & Preprocessing</div>
      </div>
    </section>
  )
}
