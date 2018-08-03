import React, { Component } from 'react';
import { Input } from 'antd';
const { TextArea } = Input;

class DatasetClassifierConfiguration extends Component {
    render() {
        return (
            <div>
                <p>Insert the criteria ahead</p>
                <TextArea rows={7} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        classifiers: state.online.classifiers.dataset
    };
};

export default DatasetClassifierConfiguration;
