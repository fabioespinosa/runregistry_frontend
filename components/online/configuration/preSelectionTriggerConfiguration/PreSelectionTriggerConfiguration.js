import React, { Component } from 'react';
import { Input } from 'antd';
const { TextArea } = Input;

class PreSelectionTriggerConfiguration extends Component {
    render() {
        return (
            <div>
                <p>Insert the criteria ahead</p>
                <TextArea rows={7} />
            </div>
        );
    }
}

export default PreSelectionTriggerConfiguration;
