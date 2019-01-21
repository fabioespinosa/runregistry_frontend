import Document, { Head, Main, NextScript } from 'next/document';

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
                    <link rel="stylesheet" href={`/_next/static/style.css`} />
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href={`/static/nprogress.css`}
                    />
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href={`/static/ant-modified.min.css`}
                    />
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href={`/static/react-table.css`}
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
