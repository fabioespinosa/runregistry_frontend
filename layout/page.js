import React, { Component } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import Progress from 'nprogress';
import { hotjar } from 'react-hotjar';
// import stylesheet from 'antd/dist/antd.min.css';
// import sweet from 'sweetalert2/dist/sweetalert2.min.css';
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

class Page extends Component {
    componentDidMount() {
        if (process.env.ENV === 'production') {
            hotjar.initialize(1018467, 6);
        }
    }
    render() {
        return (
            <div>
                <Head>
                    <meta charSet="utf-8" />
                    <title>*TRIAL* CMS Run Registry</title>
                </Head>
                <Nav
                    router={this.props.router}
                    show_sidebar={this.props.show_sidebar}
                >
                    {this.props.children}
                </Nav>
                <style jsx global>{`
                    * {
                        margin: 0;
                        padding: 0;
                    }

                    *,
                    *::before,
                    *::after {
                        box-sizing: inherit;
                    }

                    html {
                        box-sizing: border-box;
                        font-size: 62.5%;
                    }

                    .swal2-popup {
                        font-size: 1.4rem !important;
                    }
                    .properly_capitalized {
                        text-transform: capitalize;
                    }
                    .recharts-tooltip-wrapper {
                        z-index: 3000;
                    }
                `}</style>
            </div>
        );
    }
}

export default Page;
