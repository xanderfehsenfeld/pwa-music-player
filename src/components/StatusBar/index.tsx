import React, { useState } from 'react'

import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
interface IProps {
  songsCached: number
}
export default ({ songsCached }: IProps) => {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => setIsOpen(false)
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={isOpen}
      autoHideDuration={4000}
      onClose={handleClose}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={
        <span id="message-id">
          {songsCached ? `${songsCached} songs saved offline` : 'caching: off'}
        </span>
      }
      action={[
        <Button key="undo" color="secondary" size="small" onClick={handleClose}>
          Close
        </Button>,
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />
  )
}
