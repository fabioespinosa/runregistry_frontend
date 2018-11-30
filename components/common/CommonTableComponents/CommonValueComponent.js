import React, { Component } from 'react';

class CommonValueComponent extends Component {
    render() {
        const { value } = this.props;
        return (
            <div style={{ textAlign: 'center' }}>
                {value ? value.value : ''}
            </div>
        );
    }
}

export default CommonValueComponent;
