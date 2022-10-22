import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'
import Header from '../Header'

const AllProjectsItems = props => {
  const {project} = props
  const {name, imageUrl} = project
  return (
    <li className="project-item">
      <img src={imageUrl} alt={name} />
      <p>{name}</p>
    </li>
  )
}

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

class AllProjects extends Component {
  state = {projects: [], category: 'ALL', apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.onFindProjects()
  }

  onFindProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {category} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${category}`

    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const allDetails = data.projects.map(eachData => ({
        id: eachData.id,
        name: eachData.name,
        imageUrl: eachData.image_url,
      }))
      this.setState({
        projects: allDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onSelectCategory = event => {
    this.setState(
      {category: event.target.value.toUpperCase()},
      this.onFindProjects,
    )
  }

  renderLoading = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllProjects = () => {
    const {projects} = this.state
    return (
      <div>
        <Header />
        <select onChange={this.onSelectCategory} className="select-style">
          {categoriesList.map(eachCategory => (
            <option value={eachCategory.id} key={eachCategory.id}>
              {eachCategory.displayText}
            </option>
          ))}
        </select>
        <ul className="projects-cont">
          {projects.map(project => (
            <AllProjectsItems project={project} key={project.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailure = () => (
    <div className="failure-cont">
      <Header />
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button">Retry</button>
    </div>
  )

  renderedProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      case apiStatusConstants.success:
        return this.renderAllProjects()
      case apiStatusConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return this.renderedProjects()
  }
}

export default AllProjects
