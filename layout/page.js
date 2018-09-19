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
        if (process.env.NODE_ENV === 'production') {
            hotjar.initialize(1018467, 6);
        }
    }
    render() {
        return (
            <div>
                <Head>
                    <meta charSet="utf-8" />
                    <title>CMS Run Registry</title>
                    {/* <link
                rel="shortcut icon"
                href="/static/images/favicon.ico"
                type="image/x-icon"
            /> */}

                    {/* {process.env.NODE_ENV === 'production' && (
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `(function(h,o,t,j,a,r){
                                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                                    h._hjSettings={hjid:1018467,hjsv:6};
                                    a=o.getElementsByTagName('head')[0];
                                    r=o.createElement('script');r.async=1;
                                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                                    a.appendChild(r);
                                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                                `
                            }}
                        />
                    )} */}
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
                `}</style>
            </div>
        );
    }
}

export default Page;
