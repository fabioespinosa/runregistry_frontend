import React, { Component } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { connect } from 'react-redux';
import {
    Breadcrumb,
    Menu,
    Dropdown,
    Button,
    Icon,
    Radio,
    message,
    Progress
} from 'antd';

import { showConfigurationModal as showOnlineConfigurationModal } from '../../../ducks/online/ui';

import { showConfigurationModal as showOfflineConfigurationModal } from '../../../ducks/offline/ui';

import { toggleWaitingList } from '../../../ducks/offline/ui';
const SubMenu = Menu.SubMenu;
const RadioGroup = Radio.Group;

class BreadcrumbCmp extends Component {
    online_menu = (
        <Menu
            onClick={({ key }) => this.props.showOnlineConfigurationModal(key)}
        >
            <Menu.Item key="dataset_classifiers">Dataset Classifiers</Menu.Item>
            <Menu.Item key="class_classifiers">Run Class Classifiers</Menu.Item>
            <Menu.Item key="component_classifiers">
                Component Classifiers
            </Menu.Item>
        </Menu>
    );

    offline_menu = (
        <Menu
            onClick={({ key }) => this.props.showOfflineConfigurationModal(key)}
        >
            <Menu.Item key="dataset_classifiers">Dataset Classifiers</Menu.Item>
            <Menu.Item key="dataset_component_classifiers">
                Component Classifiers
            </Menu.Item>
            <Menu.Item key="column_configuration">Manage Columns</Menu.Item>
            <Menu.Item key="datasets_accepted_configuration">
                Manage Datasets Accepted
            </Menu.Item>
            <SubMenu key="expert_tools" title="DC Expert Tools">
                <Menu.Item key="component_sync">Component Sync</Menu.Item>
                <Menu.Item key="lumisection_exception_sync">
                    LS Exception Sync
                </Menu.Item>
                {/* <Menu.Item key="component_sync">Component Sync</Menu.Item> */}
            </SubMenu>
        </Menu>
    );

    render() {
        const {
            children,
            show_all_runs,
            show_waiting_list,
            toggleWaitingList,
            router: {
                query: { type, section, workspace }
            },
            online
        } = this.props;
        return (
            <div className="breadcrumb_container">
                <Breadcrumb className="breadcrumb properly_capitalized">
                    {children}
                </Breadcrumb>
                <div className="show_all">
                    {/* {
                        <Menu
                            onClick={evt => toggleWaitingList(evt.key)}
                            selectedKeys={[
                                show_waiting_list
                                    ? 'show_waiting_list'
                                    : 'show_datasets'
                            ]}
                            mode="horizontal"
                            style={{
                                background: '#f0f2f5',
                                marginRight: '60px'
                            }}
                        >
                            <Menu.Item key="show_waiting_list">
                                <Icon type="clock-circle" />
                                Show waiting list
                            </Menu.Item>
                            <Menu.Item key="show_datasets">
                                <Icon type="copy" /> Show Editable datasets
                            </Menu.Item>
                        </Menu>
                    } */}
                    {section === 'cycles' && (
                        <Link
                            href={`/offline?type=offline&section=datasets&workspace=${workspace}`}
                            as={`/offline/datasets/${workspace}`}
                        >
                            <a>
                                <Button type="primary" size="large" icon="copy">
                                    Show All Datasets
                                </Button>
                            </a>
                        </Link>
                    )}
                    {section === 'datasets' && (
                        <Link
                            href={`/offline?type=offline&section=cycles&workspace=${workspace}`}
                            as={`/offline/cycles/${workspace}`}
                        >
                            <a>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon="retweet"
                                >
                                    Show Cycles
                                </Button>
                            </a>
                        </Link>
                    )}
                </div>
                <div className="progresscircle_container">
                    <div>
                        <a
                            className="jira"
                            target="_blank"
                            href="https://its.cern.ch/jira/projects/NEWRUNREGISTRY/issues/"
                        >
                            Feedback is welcome! (JIRA)
                        </a>
                    </div>
                    <Dropdown
                        overlay={online ? this.online_menu : this.offline_menu}
                    >
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
                    .show_all {
                        margin-right: -170px;
                    }
                    .jira {
                        margin-right: 15px;
                    }
                    .progresscircle_container {
                        display: flex;
                        justify-content: space-around;
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

const mapStateToProps = state => {
    return {
        show_all_runs: state.online.ui.show_all_runs,
        show_waiting_list: state.offline.ui.show_waiting_list
    };
};

export default connect(
    mapStateToProps,
    {
        showOnlineConfigurationModal,
        showOfflineConfigurationModal,
        toggleWaitingList
    }
)(BreadcrumbCmp);
