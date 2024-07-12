import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const AppToaster = ({ theme, ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-canvas group-[.toaster]:text-fg group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-fg-muted',
          closeButton: 'group-[.toast]:bg-canvas',
        },
      }}
      {...props}
    />
  )
}

export { AppToaster }
