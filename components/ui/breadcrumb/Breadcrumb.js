import React, { Component } from 'react';
import { Breadcrumb } from 'antd';

class BreadcrumbCmp extends Component {
    render() {
        return (
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Online</Breadcrumb.Item>
                <Breadcrumb.Item>Runs</Breadcrumb.Item>
                <Breadcrumb.Item>All</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}

export default BreadcrumbCmp;
