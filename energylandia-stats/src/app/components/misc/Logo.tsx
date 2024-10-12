import React from 'react'
import classnames from 'classnames'

type Props = {
  className?: string
}

export default function Logo({className}: Props) {
  return (
    <img className={classnames(className)} src="https://energylandia.pl/wp-content/themes/plm/assets/img/logo-2024.png" alt="energylandia" />
  )
}
