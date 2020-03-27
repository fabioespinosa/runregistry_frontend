import { certifiable_online_components } from '../../../../config/config';
import { Tooltip } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import Status from '../../../common/CommonTableComponents/Status';

const column_generator = ({
  showManageRunModal,
  showClassifierVisualizationModal,
  moveRun,
  showLumisectionModal,
  significant_runs,
  markSignificant,
  workspace,
  workspaces
}) => {
  let columns = [
    {
      Header: 'Run Number',
      id: 'run_number',
      accessor: 'run_number',
      prefix_for_filtering: '',
      maxWidth: 90,
      resizable: false,
      Cell: ({ original, value }) => (
        <div style={{ textAlign: 'center', width: '100%' }}>
          <a onClick={() => showManageRunModal(original)}>{value}</a>
        </div>
      )
    },
    {
      Header: 'Class',
      id: 'class',
      accessor: 'class',
      prefix_for_filtering: 'rr_attributes',
      Cell: ({ original, value }) => (
        <div style={{ textAlign: 'center' }}>
          <a onClick={() => showClassifierVisualizationModal(original)}>
            {value}
          </a>
        </div>
      )
    },
    {
      Header: 'Manage / LS',
      id: 'manage',
      sortable: false,
      maxWidth: 75,
      Cell: ({ original }) => (
        <div style={{ textAlign: 'center' }}>
          <span>
            <a onClick={() => showManageRunModal(original)}>Manage</a>
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
      prefix_for_filtering: 'rr_attributes',
      maxWidth: 90,
      sortable: !significant_runs,
      Cell: ({ original, value }) => (
        <div style={{ textAlign: 'center' }}>
          {value ? (
            <CheckOutlined />
          ) : (
            <a
              onClick={async () => {
                const { value } = await Swal({
                  type: 'warning',
                  title: 'Are you sure you want to make the run Significant',
                  text: '',
                  showCancelButton: true,
                  confirmButtonText: 'Yes',
                  reverseButtons: true,
                  footer: '<a >What does this mean?</a>'
                });
                if (value) {
                  const { run_number } = original;
                  await markSignificant(run_number);
                  await Swal(
                    `Run ${run_number} marked significant`,
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
      prefix_for_filtering: 'rr_attributes',
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
                  const { run_number, state: from_state } = original;

                  const options = {
                    OPEN: 'To OPEN',
                    SIGNOFF: 'to SIGNOFF',
                    COMPLETED: 'to COMPLETED'
                  };
                  delete options[value];
                  const { value: to_state } = await Swal({
                    title: `Move run ${run_number} to...`,
                    input: 'select',
                    inputOptions: options,
                    showCancelButton: true,
                    reverseButtons: true
                  });
                  if (to_state) {
                    await moveRun(run_number, from_state, to_state);
                    await Swal(
                      `Run ${run_number} Moved to ${to_state}`,
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
        } else {
          return (
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  color: 'white',
                  fontSize: '0.8em',
                  color: 'grey',
                  borderRadius: '1px'
                }}
              >
                <span style={{ padding: '2px' }}>Non Significant(Open)</span>
              </span>
            </div>
          );
        }
      }
    },
    {
      Header: 'Started',
      id: 'start_time',
      accessor: 'start_time',
      prefix_for_filtering: 'oms_attributes'
    },
    {
      Header: 'Hlt Key Description',
      id: 'hlt_key',
      accessor: 'hlt_key',
      prefix_for_filtering: 'oms_attributes'
    },
    {
      Header: 'LS Duration',
      id: 'ls_duration',
      maxWidth: 70,
      accessor: 'ls_duration',
      prefix_for_filtering: 'oms_attributes',
      Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>
    },
    {
      Header: 'GUI',
      maxWidth: 40,
      Cell: ({ original }) => (
        <div style={{ textAlign: 'center' }}>
          <a
            target="_blank"
            href={`https://cmsweb.cern.ch/dqm/online/start?runnr=${original.run_number};sampletype=online_data;workspace=Summary`}
          >
            GUI
          </a>
        </div>
      )
    }
  ];

  const other_columns = [
    {
      Header: 'B Field',
      id: 'b_field',
      accessor: 'b_field',
      prefix_for_filtering: 'oms_attributes'
    },
    {
      Header: 'Clock Type',
      id: 'clock_type',
      accessor: 'clock_type',
      prefix_for_filtering: 'oms_attributes'
    }
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
          column.startsWith(workspace.toLowerCase()) && column.includes('-')
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
      prefix_for_filtering: 'triplet_summary',
      accessor: data => {
        const triplet = data.triplet_summary[column['accessor']];
        return triplet;
      },
      Cell: ({ original, value }) => (
        <Status
          run={original}
          significant={original.significant}
          triplet_summary={value}
          run_number={original.run_number}
          dataset_name="online"
          component={column['accessor']}
        />
      )
    };
  });
  columns = [...columns, ...online_columns_composed, ...other_columns];
  return columns;
};
export default column_generator;
