import Document, { Head, Main, NextScript } from 'next/document';
import { root_url_prefix } from '../config/config';

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        const assetPrefix = this.props.__NEXT_DATA__.assetPrefix;

        return (
            <html>
                <Head>
                    <link
                        rel="stylesheet"
                        href={`${root_url_prefix}/_next/static/style.css`}
                    />
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href={`${root_url_prefix}/static/nprogress.css`}
                    />
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href={`${root_url_prefix}/static/ant-modified.min.css`}
                    />
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href={`${root_url_prefix}/static/react-table.css`}
                    />
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
                    />
                </Head>
                <body className="custom_class">
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
