import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Slider from '@material-ui/core/Slider'

const PrettoSlider = withStyles({
  root: {
    color: 'lightgray',
    height: 2,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundImage:
      'linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)',
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider)

interface IProps {
  percent: number
  onScrub?: (percent: number) => void
}

export default ({ percent, onScrub }: IProps) => (
  <PrettoSlider
    value={percent * 100}
    onChange={(_, v) => {
      if (onScrub) {
        if (Array.isArray(v)) {
          onScrub(v[0] / 100)
        } else {
          onScrub(v / 100)
        }
      }
    }}
  />
)
