import { type SVGProps } from 'react'
import href from './icons/sprite.svg'
import { type IconName } from '@/icon-name'

export { href }
export { IconName }

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: IconName
}) {
  return (
    <svg {...props}>
      <use href={`${href}#${name}`} />
    </svg>
  )
}
