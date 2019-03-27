import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Button } from 'antd';
import { getCycles } from '../../../ducks/offline/cycles';
import { showCreateCycleModal } from '../../../ducks/offline/ui';
import CreateCycleModal from './createCycle/CreateCycleModal';

class Cycles extends Component {
    componentDidMount() {
        this.props.getCycles();
    }
    render() {
        console.log(this.props.cycles);
        const { cycles } = this.props;
        return (
            <div className="cycles">
                <CreateCycleModal />
                <h3>Certification Cycles</h3>
                <div className="cycle_list">
                    <List
                        itemLayout="horizontal"
                        bordered
                        dataSource={cycles}
                        renderItem={cycle => (
                            <List.Item>
                                <List.Item.Meta
                                    title={
                                        <a onClick={() => {}}>
                                            {cycle.createdAt}
                                        </a>
                                    }
                                    description={`Contains ${
                                        cycle.CycleDataset.length
                                    } Dataset(s)`}
                                />
                            </List.Item>
                        )}
                    />
                </div>
                <div className="create_cycle">
                    <Button onClick={this.props.showCreateCycleModal}>
                        Create new cycle
                    </Button>
                </div>
                <style jsx>{`
                    .cycles {
                        margin-right: 30px;
                    }
                    .cycle_list {
                        height: 500px;
                        overflow-y: scroll;
                    }
                    .create_cycle {
                        text-align: center;
                        margin-top: 20px;
                    }
                `}</style>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        cycles: state.offline.cycles
    };
};
export default connect(
    mapStateToProps,
    { getCycles, showCreateCycleModal }
)(Cycles);
