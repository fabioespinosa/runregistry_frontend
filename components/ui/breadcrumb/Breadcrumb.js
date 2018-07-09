import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import {
    Breadcrumb,
    Menu,
    Dropdown,
    Button,
    Icon,
    message,
    Progress
} from 'antd';

import { showConfigurationModal } from '../../../ducks/online/ui';

class BreadcrumbCmp extends Component {
    state = {
        seconds_to_refresh: 40
    };
    componentDidMount() {
        const interval = setInterval(() => {
            if (this.state.seconds_to_refresh >= 0) {
                this.setState({
                    seconds_to_refresh: this.state.seconds_to_refresh - 1
                });
            } else {
                this.setState({ seconds_to_refresh: 40 });
            }
        }, 1000);
    }

    menu = (
        <Menu
            onClick={({ key }) => {
                this.props.showConfigurationModal(key);
            }}
        >
            <Menu.Item key="pre_selection_configuration">
                Change which runs classify as a Pre-Selected Run
            </Menu.Item>
            <Menu.Item key="class_configuration">
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

                <div className="progresscircle_container">
                    <p className="progresscircle_label">Refreshing in:</p>
                    <div className="progresscircle">
                        <Progress
                            status="active"
                            type="circle"
                            width={35}
                            percent={this.state.seconds_to_refresh * 2.5}
                            format={progress => `${progress / 2.5}s`}
                        />
                    </div>
                    <Dropdown overlay={this.menu}>
                        <Button style={{ marginTop: '-6px' }}>
                            Configuration
                            <Icon type="down" />
                        </Button>
                    </Dropdown>
                </div>

                <style jsx>{`
                    .breadcrumb_container {
                        display: flex;
                        justify-content: space-between;
                        align-content: center;
                        margin-top: 12px;
                        margin-bottom: 8px;
                    }
                    .progresscircle_container {
                        display: flex;
                    }
                    .progresscircle_label {
                        margin: 0;
                        margin-right: 10px;
                        font-size: 14px;
                    }

                    .progresscircle {
                        margin-top: -8px;
                        margin-right: 5px;
                    }
                `}</style>
            </div>
        );
    }
}

export default connect(
    null,
    { showConfigurationModal }
)(BreadcrumbCmp);
