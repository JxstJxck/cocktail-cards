import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { AuthProvider } from '../components/AuthProvider'
import '../styles/globals.css'

// mantine components with next.js link 
// https://mantine.dev/theming/next/#mantine-components-with-next-link

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <Component {...pageProps} />
        </ModalsProvider>
      </MantineProvider>
    </AuthProvider>
  )
}

export default MyApp
