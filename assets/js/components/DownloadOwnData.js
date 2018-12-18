import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import {
  profileApiUrl,
  tunnistamoUrl,
  profileToken,
  tunnistamoToken
} from '../settings'

import createClient from '../util/client'

class DownloadOwnData extends Component {
  downloadData = obj => {
    const data =
      'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj))

    var a = document.createElement('a')
    a.href = 'data:' + data
    a.download = 'data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  getDataAndDownload() {
    const { onError } = this.props

    const profileConfig = {
      headers: {
        Authorization: `Bearer ${profileToken}`
      }
    }

    const data = {
      userProfileData: {},
      userServiceData: {},
      userLoginEntryData: {},
      userConsentData: {},
      success: true
    }

    let userProfileData = createClient(profileConfig)
      .get(`${profileApiUrl}/profile/`)
      .then(res => {
        data.userProfileData = res.data.results
      }, (data.success = false))

    const tunnistamoConfig = {
      headers: { Authorization: `Bearer ${tunnistamoToken}` }
    }

    let userServiceData = createClient(tunnistamoConfig)
      .get(`${tunnistamoUrl}/v1/service/`)
      .then(res => {
        data.userServiceData = res.data.results
      }, (data.success = false))

    let userLoginEntryData = createClient(tunnistamoConfig)
      .get(`${tunnistamoUrl}/v1/user_login_entry/`)
      .then(res => {
        data.userLoginEntryData = res.data.results
      }, (data.success = false))

    let userConsentData = createClient(tunnistamoConfig)
      .get(`${tunnistamoUrl}/v1/user_consent/`)
      .then(res => {
        data.userConsentData = res.data.results
      }, (data.success = false))

    Promise.all([
      userProfileData,
      userServiceData,
      userLoginEntryData,
      userConsentData
    ]).then(
      values => {
        this.downloadData(data)
      },
      error => (data.success = false)
    )

    if (!data.success) {
      onError()
    }
  }

  render() {
    return (
      <Button
        className="profile__button"
        type="submit"
        color="primary"
        onClick={() => this.getDataAndDownload()}
      >
        <FormattedMessage id="app.button.downloadData" />
      </Button>
    )
  }
}

export default DownloadOwnData
