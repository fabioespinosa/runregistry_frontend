import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import { Breadcrumb, Menu, Dropdown, Button, Icon, message } from 'antd';

import { showConfigurationModal } from '../../../ducks/online';

class BreadcrumbCmp extends Component {
    menu = (
        <Menu
            onClick={(item, key, keypath) => {
                this.props.showConfigurationModal();
            }}
        >
            <Menu.Item key="1">
                Change which runs classify as a Pre-Selected Run
            </Menu.Item>
            <Menu.Item key="2">
                Change which runs classify as a certain Run Class (Collission,
                Cosmic, Commission)
            </Menu.Item>
        </Menu>
    );
    render() {
        const { children } = this.props;
        return (
            <div className="breadcrumb_container">
                <Breadcrumb className="breadcrumb properly_capitalized">
                    {children}
                </Breadcrumb>
                <Dropdown overlay={this.menu}>
                    <Button style={{ marginTop: '-6px' }}>
                        Configuration
                        <Icon type="down" />
                    </Button>
                </Dropdown>

                <style jsx>{`
                    .breadcrumb_container {
                        display: flex;
                        justify-content: space-between;
                        align-content: center;
                        margin-top: 12px;
                        margin-bottom: 8px;
                    }
                `}</style>
            </div>
        );
    }
}

export default connect(null, { showConfigurationModal })(BreadcrumbCmp);
