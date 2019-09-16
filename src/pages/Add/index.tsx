import React, { useState } from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import CircularProgress from '@material-ui/core/CircularProgress'
import 'firebase/functions'
import * as firebaseFunctions from 'firebase/app'

import './style.scss'
import GradientButton from '../../components/GradientButton'

const functions = firebaseFunctions.functions()
const startYoutubeDownload = functions.httpsCallable('startYoutubeDownload')

const Add = ({ switchToListView }: { switchToListView: () => void }) => {
  const [url, setUrl] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [, setApiError] = useState('')

  return (
    <div style={{ padding: '0 30px' }}>
      <ValidatorForm
        onSubmit={async () => {
          setIsPosting(true)
          setApiError('')

          startYoutubeDownload({ url })
            .then((result) => {
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
        <GradientButton type={'submit'} disabled={!url || isPosting}>
          Download
        </GradientButton>
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
