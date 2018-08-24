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

    menu = online => (
        <Menu
            onClick={({ key }) => {
                if (online) {
                    this.props.showOnlineConfigurationModal(key);
                } else {
                    this.props.showOfflineConfigurationModal(key);
                }
            }}
        >
            <Menu.Item key="dataset_classifiers">Dataset Classifiers</Menu.Item>
            <Menu.Item key="class_classifiers">Run Class Classifiers</Menu.Item>
            <Menu.Item key="component_classifiers">
                Component Classifiers
            </Menu.Item>
            {!online && (
                <Menu.Item key="column_configuration">Manage Columns</Menu.Item>
            )}
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
                <div>
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
                    {/* <p className="progresscircle_label">Refreshing in:</p>
                    <div className="progresscircle">
                        <Progress
                            status="active"
                            type="circle"
                            width={35}
                            percent={this.state.seconds_to_refresh * 2.5}
                            format={progress => `${progress / 2.5}s`}
                        />
                    </div> */}
                    <Dropdown overlay={this.menu(online)}>
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
