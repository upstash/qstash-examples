import type { AppProps } from 'next/app'
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  IMessage,
} from '@novu/notification-center';
import { useRouter } from 'next/router';
import { GeistProvider, CssBaseline } from '@geist-ui/core'


function MyApp({ Component, pageProps }: AppProps) {
 
  return (
    <GeistProvider>
      <CssBaseline />
      <Component {...pageProps}/>
    </GeistProvider>

  )
}

export default MyApp
