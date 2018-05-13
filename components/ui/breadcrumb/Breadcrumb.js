import React, { Component } from 'react';
import Router from 'next/router';
import { Breadcrumb } from 'antd';

class BreadcrumbCmp extends Component {
    render() {
        const {
            router: {
                query: { type, section, run_filter }
            }
        } = this.props;
        return (
            <Breadcrumb
                className="properly_capitalized"
                style={{ margin: '16px 0' }}
            >
                <Breadcrumb.Item>{type}</Breadcrumb.Item>
                <Breadcrumb.Item>{section}</Breadcrumb.Item>
                <Breadcrumb.Item>{run_filter}</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}

export default BreadcrumbCmp;
