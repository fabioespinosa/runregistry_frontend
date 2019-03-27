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
    showManageDatasetModal,
    showLumisectionModal,
    workspace,
    workspaces,
    moveDataset,
    toggleShowFilters,
    filter_object
}) => {
    let columns = [
        {
            Header: 'Run Number',
            accessor: 'run_number',
            maxWidth: 90,
            resizable: false,
            Cell: ({ original, value }) => (
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <a onClick={() => showManageDatasetModal(original)}>
                        {value}
                    </a>
                </div>
            )
        },
        { Header: 'Dataset Name', accessor: 'name', maxWidth: 250 },
        {
            Header: 'Class',
            accessor: 'class',
            maxWidth: 90,
            Cell: ({ original }) => (
                <div style={{ textAlign: 'center' }}>{original.Run.class}</div>
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
                        <a onClick={() => showManageDatasetModal(original)}>
                            Manage
                        </a>
                        {' / '}
                    </span>
                    <a onClick={evt => showLumisectionModal(original)}>LS</a>
                </div>
            )
        },
        {
            Header: 'Appeared In',
            id: 'appeared_in',
            accessor: 'appeared_in',
            maxWidth: 150,
            Cell: ({ original, value }) => (
                <div style={{ textAlign: 'center' }}>
                    <span
                        style={{
                            fontSize: '0.95em',
                            fontWeight: 'bold',
                            borderRadius: '1px'
                        }}
                    >
                        <span style={{ padding: '4px' }}>{value}</span>
                    </span>
                </div>
            )
        },
        {
            Header: `${workspace} State`,
            id: `${workspace.toLowerCase()}_state`,
            accessor: `${workspace.toLowerCase()}_state`,
            minWidth: 145,
            maxWidth: 145,
            Cell: ({ original, value }) => (
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
                            const { run_number, name } = original;
                            let options = {
                                OPEN: 'To OPEN',
                                SIGNOFF: 'to SIGNOFF',
                                COMPLETED: 'to COMPLETED'
                            };

                            if (value === 'waiting dqm gui') {
                                options = { OPEN: 'To OPEN' };
                            }
                            delete options[value];
                            const { value: to_state } = await Swal({
                                title: `Move dataset manually ${name} of run ${run_number} to...`,
                                input: 'select',
                                inputOptions: options,
                                showCancelButton: true,
                                reverseButtons: true
                            });
                            if (to_state) {
                                await moveDataset(
                                    {
                                        run_number,
                                        dataset_name: name
                                    },
                                    workspace.toLowerCase(),
                                    to_state
                                );
                                await Swal(
                                    `Dataset ${name} of run ${run_number} Moved to ${to_state}`,
                                    '',
                                    'success'
                                );
                            }
                        }}
                    >
                        move
                    </a>
                </div>
            )
        },
        { Header: 'Dataset Created', accessor: 'createdAt', maxWidth: 150 }
    ];
    // {
    //     Header: 'Hlt Key Description',
    //     accessor: 'hlt_key'
    // },
    // {
    //     Header: 'GUI',
    //     filterable: false,
    //     maxWidth: 50,
    //     Cell: ({ original }) => (
    //         <div style={{ textAlign: 'center' }}>
    //             <a
    //                 target="_blank"
    //                 href={`https://cmsweb.cern.ch/dqm/offline/start?runnr=${
    //                     original.run_number
    //                 };sampletype=offline_data;workspace=Summary`}
    //             >
    //                 GUI
    //             </a>
    //         </div>
    //     )
    // }

    // all_columns_formatted are in the form of workspace-subcomponent like csc-efficiency
    const all_columns_formatted = [];
    workspaces.forEach(({ workspace, columns }) => {
        all_columns_formatted.push(`${workspace}-${workspace}`);
        columns.forEach(column => {
            all_columns_formatted.push(`${workspace}-${column}`);
        });
    });

    // Put components in format Header: component
    let offline_columns_composed = [];
    if (workspace === 'global') {
        offline_columns_composed = all_columns_formatted
            .filter(column => {
                const split_name = column.split('-');
                // If the name is workspace-workspace, it will be the official status of the workspace:
                return split_name[0] === split_name[1];
            })
            .map(column => ({
                accessor: column,
                Header: column.split('-')[1]
            }));
    } else {
        offline_columns_composed = all_columns_formatted
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

    offline_columns_composed = offline_columns_composed.map(column => {
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
                    significant={true}
                    triplet_summary={value}
                    run_number={original.run_number}
                    dataset_name={original.name}
                    component={`${column['accessor']}`}
                />
            )
        };
    });
    columns = [...columns, ...offline_columns_composed];
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
                            evt.stopPropagation();
                        }}
                        type="search"
                        style={{ fontSize: '10px' }}
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
