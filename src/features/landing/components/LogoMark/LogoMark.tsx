import difLogo from '../../../../assets/logo/dif-logo.svg'
import './LogoMark.scss'

type LogoMarkProps = {
  large?: boolean
}

export function LogoMark({ large = false }: LogoMarkProps) {
  return (
    <img
      alt="Damascus International Fair"
      className={large ? 'dif-logo dif-logo--large' : 'dif-logo'}
      src={difLogo}
    />
  )
}
