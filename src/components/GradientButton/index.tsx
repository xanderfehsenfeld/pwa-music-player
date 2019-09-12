import Button from '@material-ui/core/Button'
import React from 'react'

export default ({
  disabled,
  children,
  ...rest
}: {
  disabled: boolean
  children: any
}) => (
  <Button
    {...rest}
    disabled={disabled}
    variant={'contained'}
    color="primary"
    type="submit"
    style={{
      width: '100%',
      backgroundImage: disabled
        ? undefined
        : 'linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)',
    }}
  >
    {children}
  </Button>
)
