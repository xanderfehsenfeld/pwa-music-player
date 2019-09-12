import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ReactComponent as AddButton } from '../../icons/add-button.svg'
import { ReactComponent as BackButton } from '../../icons/left-arrow.svg'
import { ReactComponent as CloseButton } from '../../icons/close.svg'
import { addClass, removeClass } from '../../helpers/classList'
import sleep from '../../helpers/sleep'
import IconButton from '../IconButton'
import './style.scss'

class Menu extends PureComponent {
  constructor() {
    super()

    this.title = React.createRef()
    this.menu = React.createRef()
  }

  _activeHiddenElements() {
    ;[...this.menu.current.querySelectorAll('.hidden')].map((elmt) =>
      addClass(elmt, 'active'),
    )
  }

  _animateTitle() {
    removeClass(this.title.current, 'active')

    requestAnimationFrame(async () => {
      await sleep(100)

      addClass(this.title.current, 'active')
    })
  }

  componentDidMount() {
    requestAnimationFrame(async () => {
      await sleep(1200)

      this._activeHiddenElements()
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeView !== this.props.activeView) {
      this._animateTitle()
    }
  }

  render() {
    const isAdd = this.props.activeView === 'add'
    return (
      <nav ref={this.menu} className={`menu menu--${this.props.activeView}`}>
        <IconButton
          label="navigate back"
          tabEnabled={true}
          className="hidden icon-button icon-button--back"
          onClick={this.props.onBackClick}
          icon={<BackButton className="icon icon--back" width={16} />}
        />
        <h1 ref={this.title} className="hidden menu__title">
          {this.props.activeView === 'beats' ? 'Beats' : ''}
          {this.props.activeView === 'songs' ? 'Songs' : ''}
          {this.props.activeView === 'detail' ? 'Now playing' : ''}
          {this.props.activeView === 'add' ? 'Add' : ''}
        </h1>

        <IconButton
          label={isAdd ? 'close' : 'add a song via youtube link'}
          tabEnabled={true}
          className={` icon-button icon-button${isAdd ? '--close' : '--help'}`}
          onClick={isAdd ? this.props.onBackClick : this.props.onAddClick}
          icon={
            isAdd ? (
              <CloseButton className="icon icon--close" width={12} />
            ) : (
              <AddButton className="icon icon--help" width={27} />
            )
          }
        />
      </nav>
    )
  }
}

Menu.propTypes = {
  activeView: PropTypes.string,
  onBackClick: PropTypes.func.isRequired,
  onAboutClick: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired,
}

export default Menu
