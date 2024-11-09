import { CacheProvider } from '@emotion/react';
import "@fontsource/aleo";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Layout from 'components/Layout';
import Head from 'next/head';
import PropTypes from 'prop-types';
import * as React from 'react';
import createEmotionCache from '../src/createEmotionCache';
import '/src/styles.scss';
import theme from '/src/theme';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Gannett.cc</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" type="image/png" href={`/logo-dive-icon.png`} />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <script data-goatcounter="https://feast-manner.goatcounter.com/count"
          async src="//gc.zgo.at/count.js"></script>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
