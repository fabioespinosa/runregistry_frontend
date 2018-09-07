import React, { Component } from 'react';
import Router from 'next/router';
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

import {
    showConfigurationModal as showOnlineConfigurationModal,
    toggleShowAllRuns
} from '../../../ducks/online/ui';

import { showConfigurationModal as showOfflineConfigurationModal } from '../../../ducks/offline/ui';

import { toggleWaitingList } from '../../../ducks/offline/ui';
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
            <Menu.Item key="class_classifiers">Run Class Classifiers</Menu.Item>
            <Menu.Item key="component_classifiers">
                Component Classifiers
            </Menu.Item>
            <Menu.Item key="column_configuration">Manage Columns</Menu.Item>
            <Menu.Item key="datasets_accepted_configuration">
                Manage Datasets Accepted
            </Menu.Item>
        </Menu>
    );

    render() {
        const {
            children,
            show_all_runs,
            show_waiting_list,
            toggleShowAllRuns,
            toggleWaitingList,
            online
        } = this.props;
        return (
            <div className="breadcrumb_container">
                <Breadcrumb className="breadcrumb properly_capitalized">
                    {children}
                </Breadcrumb>
                <div className="show_all">
                    {online ? (
                        <RadioGroup
                            onChange={evt =>
                                toggleShowAllRuns(evt.target.value)
                            }
                            value={
                                show_all_runs
                                    ? 'show_all_runs'
                                    : 'show_significant_runs'
                            }
                        >
                            <Radio value="show_all_runs">Show all runs</Radio>
                            <Radio value="show_significant_runs">
                                Show significant runs
                            </Radio>
                        </RadioGroup>
                    ) : (
                        <RadioGroup
                            onChange={evt =>
                                toggleWaitingList(evt.target.value)
                            }
                            value={
                                show_waiting_list
                                    ? 'show_waiting_list'
                                    : 'show_datasets'
                            }
                        >
                            <Radio value="show_waiting_list">
                                Show waiting list
                            </Radio>
                            <Radio value="show_datasets">Show datasets</Radio>
                        </RadioGroup>
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
        toggleShowAllRuns,
        toggleWaitingList
    }
)(BreadcrumbCmp);
