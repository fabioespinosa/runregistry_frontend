import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import { offline_columns } from '../../../../../config/config';

class ColumnEditor extends Component {
    state = { selected: '' };
    render() {
        const { pog, columns, addColumn, removeColumn } = this.props;
        return (
            <div>
                <h3>
                    Add/Remove Columns to workspace <strong>{pog}</strong>
                </h3>
                <br />
                <div className="container">
                    <div className="remove_column">
                        <h4>Remove columns:</h4>
                        <ul className="columns">
                            {columns.map(column => (
                                <li key={`remove_${column}`} className="column">
                                    <div className="column_container">
                                        <Button
                                            onClick={() =>
                                                removeColumn(pog, column)
                                            }
                                            type="danger"
                                        >
                                            <Icon type="close-circle-o" />
                                        </Button>
                                        <div className="column_text">
                                            {column}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="add_column">
                        <h4>Add a new column</h4>
                        <div className="add_column_container">
                            <select
                                name=""
                                id=""
                                value={this.state.selected}
                                onChange={evt =>
                                    this.setState({
                                        selected: evt.target.value
                                    })
                                }
                            >
                                {offline_columns.map(column => (
                                    <option key={column} value={column}>
                                        {column}
                                    </option>
                                ))}
                            </select>
                            <Button
                                onClick={() =>
                                    addColumn(pog, this.state.selected)
                                }
                            >
                                Add column
                            </Button>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .container {
                        display: flex;
                        justify-content: space-around;
                    }
                    .columns {
                        list-style: none;
                    }
                    .column {
                        margin-top: 8px;
                    }
                    .column_container {
                        display: flex;

                        margin-left: 15px;
                    }
                    .column_text {
                        margin-left: 10px;
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                        text-align: center;
                    }
                    .add_column_container {
                        display: flex;
                        justify-content: space-between;
                    }

                    .add_column_container > select {
                        margin-right: 10px;
                    }
                `}</style>
            </div>
        );
    }
}

export default ColumnEditor;
