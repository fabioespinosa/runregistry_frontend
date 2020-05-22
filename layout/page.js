import React, { Component } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import Progress from 'nprogress';
import { connect } from 'react-redux';
// import { hotjar } from 'react-hotjar';
import Swal from 'sweetalert2';
// import stylesheet from 'antd/dist/antd.min.css';
// import sweet from 'sweetalert2/dist/sweetalert2.min.css';
import { initGA, logPageView } from '../services/analytics';
import Nav from './../components/ui/nav/Nav';
import { colors } from '../components/ui/theme';

/**
 * Starts nprogress (the 5px colored bar on top that appears progressing as route changes)
 * @param {*} url
 */
Router.onRouteChangeStart = (url) => Progress.start();
Router.onRouteChangeComplete = () => Progress.done();
Router.onRouteChangeError = () => Progress.done();

class Page extends Component {
  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      if (location && location.href) {
        if (location.href.includes('dev-cmsrunregistry')) {
          // hotjar.initialize(1731488, 6);
          Swal({
            type: 'warning',
            title: 'You are not in Production RR',
            html: `This environment of RR is only for testing, please use it freely to test all features, none of the results will be taken into account for certification. <br/><br/>
                   For production Run Registry go to <br/> <a href="https://cmsrunregistry.web.cern.ch">cmsrunregistry.web.cern.ch</a>. <br/><br/>
                   We are actively looking for bugs in the application, please report anything weird to <a href="mailto:cms-dqm-coreTeam@cern.ch">cms-dqm-coreTeam@cern.ch</a>`,
          });
        } else if (location.href.includes('cmsrunregistry')) {
          // hotjar.initialize(1732502, 6);
        }
      }
    }
  }
  render() {
    const { router, children, env, side_nav } = this.props;
    const title =
      env === 'production' ? 'CMS Run Registry' : 'NON PRODUCTION RR';

    return (
      <div>
        <Head>
          <meta charSet="utf-8" />
          <title>{title}</title>
        </Head>
        <Nav router={router} side_nav={side_nav}>
          {children}
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
          .underline:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }
}

const mapStatetoProps = (state) => {
  return {
    env: state.info.environment,
  };
};
export default connect(mapStatetoProps)(Page);
