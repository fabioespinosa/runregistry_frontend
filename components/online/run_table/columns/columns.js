import { components, rr_attributes } from '../../../../config/config';

import { certifiable_online_components } from '../../../../config/config';
import { Icon, Tooltip } from 'antd';
import Swal from 'sweetalert2';
import Status from '../../../common/CommonTableComponents/Status';

const column_filter_description = {
    string: '=, like, notlike, <>',
    date: '>, <, >=, <=, <>',
    component: '=, like, notlike, <>',
    boolean: 'true, false'
};
const column_types = {
    'hlt_key.value': 'string',
    'class.value': 'string',
    run_number: 'integer',
    class: 'string',
    significant: 'boolean',
    'state.value': 'string',
    b_field: 'integer',
    start_time: 'date',
    hlt_key: 'string',
    duration: 'integer',
    clock_type: 'string',
    component: 'component'
};

const column_generator = ({
    showManageRunModal,
    showClassifierVisualizationModal,
    moveRun,
    showLumisectionModal,
    toggleShowFilters,
    significant_runs,
    filterable,
    markSignificant,
    filter_object,
    workspace,
    workspaces
}) => {
    let columns = [
        {
            Header: 'Run Number',
            accessor: 'run_number',
            maxWidth: 110,
            resizable: false,
            Cell: ({ original, value }) => (
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <a onClick={() => showManageRunModal(original)}>{value}</a>
                </div>
            )
        },
        {
            Header: 'Class',
            accessor: 'class',
            Cell: ({ original, value }) => (
                <div style={{ textAlign: 'center' }}>
                    <a
                        onClick={() =>
                            showClassifierVisualizationModal(original)
                        }
                    >
                        {value}
                    </a>
                </div>
            )
        },
        {
            Header: 'Manage / LS',
            id: 'manage',
            filterable: false,
            sortable: false,
            maxWidth: 75,
            Cell: ({ original }) => (
                <div style={{ textAlign: 'center' }}>
                    <span>
                        <a onClick={() => showManageRunModal(original)}>
                            Manage
                        </a>
                        {' / '}
                    </span>
                    <a onClick={() => showLumisectionModal(original)}>LS</a>
                </div>
            )
        },
        {
            Header: 'Significant',
            id: 'significant',
            accessor: 'significant',
            maxWidth: 100,
            filterable: !significant_runs && filterable,
            sortable: !significant_runs,
            Cell: ({ original, value }) => (
                <div style={{ textAlign: 'center' }}>
                    {value ? (
                        <Icon type={'check'} />
                    ) : (
                        <a
                            onClick={async () => {
                                const { value } = await Swal({
                                    type: 'warning',
                                    title:
                                        'Are you sure you want to make the run Significant',
                                    text: '',
                                    showCancelButton: true,
                                    confirmButtonText: 'Yes',
                                    reverseButtons: true,
                                    footer: '<a >What does this mean?</a>'
                                });
                                if (value) {
                                    await markSignificant(original);
                                    await Swal(
                                        `Run ${
                                            original.run_number
                                        } marked significant`,
                                        '',
                                        'success'
                                    );
                                }
                            }}
                        >
                            Make significant
                        </a>
                    )}
                </div>
            )
        },
        {
            Header: 'State',
            id: 'state',
            accessor: 'state',
            Cell: ({ original, value }) => {
                if (original.significant) {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <span
                                style={{
                                    color: 'white',
                                    fontSize: '0.95em',
                                    fontWeight: 'bold',
                                    color: value === 'OPEN' ? 'red' : 'grey',
                                    borderRadius: '1px'
                                }}
                            >
                                <span style={{ padding: '4px' }}>{value}</span>
                            </span>
                            {' / '}
                            <a
                                onClick={async () => {
                                    const options = {
                                        OPEN: 'To OPEN',
                                        SIGNOFF: 'to SIGNOFF',
                                        COMPLETED: 'to COMPLETED'
                                    };
                                    delete options[value];
                                    const { value: to_state } = await Swal({
                                        title: `Move run ${
                                            original.run_number
                                        } to...`,
                                        input: 'select',
                                        inputOptions: options,
                                        showCancelButton: true,
                                        reverseButtons: true
                                    });
                                    if (to_state) {
                                        await moveRun(
                                            original,
                                            original.state,
                                            to_state
                                        );
                                        await Swal(
                                            `Run ${
                                                original.run_number
                                            } Moved to ${to_state}`,
                                            '',
                                            'success'
                                        );
                                    }
                                }}
                            >
                                move
                            </a>
                        </div>
                    );
                }
            }
        },
        { Header: 'Started', accessor: 'start_time' },
        {
            Header: 'Hlt Key Description',
            accessor: 'hlt_key'
        },
        {
            Header: 'GUI',
            filterable: false,
            maxWidth: 40,
            Cell: ({ original }) => (
                <div style={{ textAlign: 'center' }}>
                    <a
                        target="_blank"
                        href={`https://cmsweb.cern.ch/dqm/online/start?runnr=${
                            original.run_number
                        };sampletype=online_data;workspace=Summary`}
                    >
                        GUI
                    </a>
                </div>
            )
        }
    ];

    const other_columns = [
        { Header: 'LS Duration', accessor: 'ls_duration' },
        { Header: 'B Field', accessor: 'b_field' },
        { Header: 'Clock Type', accessor: 'clock_type' }
    ];
    // Now add the ones in global:
    const global_columns = [];
    for (const [key, val] of Object.entries(certifiable_online_components)) {
        val.forEach(sub_name => {
            global_columns.push(`${key}-${sub_name}`);
        });
    }
    // all_columns_formatted are in the form of workspace-subcomponent like csc-efficiency
    let all_columns_formatted = [];

    workspaces.forEach(({ workspace, columns }) => {
        columns.forEach(column => {
            const column_name = `${workspace}-${column}`;
            if (!global_columns.includes(column_name)) {
                all_columns_formatted.push(column_name);
            }
        });
    });

    all_columns_formatted = global_columns.concat(all_columns_formatted);
    // Put components in format Header: component
    let online_columns_composed = [];
    if (workspace === 'global') {
        online_columns_composed = global_columns.map(column => ({
            accessor: column,
            Header: column.split('-')[1]
        }));
    } else {
        online_columns_composed = all_columns_formatted
            .filter(column => {
                return (
                    column.startsWith(workspace.toLowerCase()) &&
                    column.includes('-')
                );
            })
            .map(column => ({
                accessor: column,
                Header: column.split('-')[1]
            }));
    }

    online_columns_composed = online_columns_composed.map(column => {
        return {
            ...column,
            maxWidth: 66,
            id: column.accessor,
            accessor: data => {
                const triplet = data.triplet_summary[column['accessor']];
                return triplet;
            },
            Cell: ({ original, value }) => (
                <Status
                    significant={original.significant}
                    triplet_summary={value}
                    run_number={original.run_number}
                    dataset_name="online"
                    component={column['accessor']}
                />
            )
        };
    });
    // console.log(online_columns_composed);
    columns = [...columns, ...online_columns_composed, ...other_columns];
    // columns = component_columns;
    columns = columns.map(column => {
        return {
            ...column,
            Header: () => (
                <div>
                    {column.Header}
                    &nbsp;&nbsp;
                    <Icon
                        onClick={evt => {
                            toggleShowFilters();
                            // The following is to stop react-table from performing a sort when a user just clicked on the magnifying glass to filter
                            evt.stopPropagation();
                        }}
                        type="search"
                        style={{ fontSize: '12px' }}
                    />
                </div>
            ),
            Filter: ({ column, onChange }) => {
                const { id } = column;
                const type = column_types[id] || 'string';
                const style = `
                        text-align: left;
                        border: 1px solid grey;
                        white-space: pre-wrap;
                        transition: all 1s;
                        margin-left: -10px;
                        margin-top: 20px;
                        padding: 9px;
                        width: 200px;
                        z-index: 900;
                        height: 270px;
                        background: white;
                        position: fixed;
                        display: none;`;
                return (
                    <div className="filter_selector" style={{ zIndex: 999 }}>
                        <input
                            defaultValue={filter_object[column.id]}
                            onMouseEnter={evt => {
                                const block = document.querySelector(
                                    `#${column.id}`
                                );
                                block.setAttribute(
                                    'style',
                                    `${style} display: inline-block;`
                                );
                            }}
                            onMouseLeave={({ clientX, clientY }) => {
                                const block = document.querySelector(
                                    `#${column.id}`
                                );
                                block.setAttribute('style', style);
                            }}
                            type="text"
                            onKeyPress={evt => {
                                if (evt.key == 'Enter') {
                                    onChange(evt.target.value);
                                }
                            }}
                            style={
                                { width: '100%' } // onChange={evt => onChange(evt.target.value)}
                            }
                        />
                        <div style={{ display: 'none' }} id={column.id}>
                            <h3
                                style={{
                                    textTransform: 'capitalize'
                                }}
                            >
                                {type} filter
                            </h3>
                            Supported operators:{' '}
                            {column_filter_description[type]}
                            <p />
                            <p>Structure:</p>
                            <p>
                                <i>operator</i> value <i>and/or</i>{' '}
                                <i>operator</i> value
                            </p>
                            <p>Examples:</p>
                            <p>
                                <i>{'='}</i> 322433
                            </p>
                            <p>
                                <i>{'>'}</i> 40 <i>and</i> <i>{'<'}</i> 100{' '}
                                <i>or</i> <i>{'>'}</i> 500
                            </p>
                            <p>
                                <i>{'like'}</i> %physics% <i>and</i>{' '}
                                <i>{'like'}</i> %2018%
                            </p>
                            <p>
                                <strong>
                                    {
                                        'Space between operator and value is mandatory'
                                    }
                                </strong>
                            </p>
                        </div>
                    </div>
                );
            }
        };
    });
    return columns;
};
export default column_generator;
