import React, { Component } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import Progress from 'nprogress';
import stylesheet from 'antd/dist/antd.min.css';
import { initGA, logPageView } from '../services/analytics';
import Nav from './../components/ui/nav/Nav';
import { colors } from '../components/ui/theme';

/**
 * Starts nprogress (the 5px colored bar on top that appears progressing as route changes)
 * @param {*} url
 */
Router.onRouteChangeStart = url => Progress.start();
Router.onRouteChangeComplete = () => Progress.done();
Router.onRouteChangeError = () => Progress.done();

/**
 * This functional component is used for
 * @param {} props
 */
const Page = props => (
    <div>
        <Head>
            <link
                rel="stylesheet"
                type="text/css"
                href="/static/nprogress.css"
            />
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />
            <link rel="stylesheet" href="/_next/static/style.css" />
        </Head>
        <Nav>{props.children}</Nav>
    </div>
);

export default Page;
