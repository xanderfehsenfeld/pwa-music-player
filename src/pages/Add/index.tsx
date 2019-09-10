import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import CircularProgress from '@material-ui/core/CircularProgress'
import 'firebase/functions'
import * as firebase from 'firebase'

import './style.scss'

const functions = firebase.functions()
const startYoutubeDownload = functions.httpsCallable('startYoutubeDownload')

const Add = ({ switchToListView }: { switchToListView: () => void }) => {
  const [url, setUrl] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [apiError, setApiError] = useState('')

  return (
    <div style={{ padding: '0 30px' }}>
      <ValidatorForm
        onSubmit={async () => {
          setIsPosting(true)
          setApiError('')

          startYoutubeDownload({ url })
            .then((result) => {
              console.log(result)
              setIsPosting(false)
              switchToListView()
            })
            .catch((e) => {
              console.log(e)
              alert('There was an error completing the request.')
              setApiError(e.message)
              setIsPosting(false)
            })
        }}
        onError={(errors) => console.log(errors)}
      >
        <TextValidator
          required
          label="Youtube Video URL"
          style={{ width: '100%', paddingBottom: 10 }}
          onChange={({ target }) =>
            setUrl((target as HTMLTextAreaElement).value)
          }
          name="Youtube Video URL"
          value={url}
          margin="dense"
          variant="outlined"
        />

        <br />
        <Button
          disabled={isPosting || !url}
          variant={'contained'}
          color="primary"
          type="submit"
          style={{
            width: '100%',
            backgroundImage:
              isPosting || !url
                ? undefined
                : 'linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)',
          }}
        >
          Download
        </Button>
        <br />
      </ValidatorForm>
      <br />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {isPosting ? (
          <CircularProgress
            style={{ marginRight: 'auto', marginLeft: 'auto' }}
          />
        ) : null}
      </div>
      {}
    </div>
  )
}

export default Add
