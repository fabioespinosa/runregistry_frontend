import Swal from 'sweetalert2';
import Status from '../../../common/CommonTableComponents/Status';
import { certifiable_offline_components } from '../../../../config/config';

const column_filter_description = {
  string: '=, like, notlike, <>',
  date: '>, <, >=, <=, <>',
  component: '=, like, notlike, <>',
  boolean: 'true, false',
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
  component: 'component',
};

const column_generator = ({
  showManageDatasetModal,
  showLumisectionModal,
  workspace,
  workspaces,
  reGenerateCache,
  visualizeDataset,
}) => {
  workspace = workspace.toLowerCase();
  let columns = [
    {
      Header: 'INCLUDED in JSON',
      accessor: 'included_in_json',
      Cell: ({ original, value }) => (
        <div
          style={{
            backgroundColor: value ? 'green' : 'red',
            width: '100%',
            height: '100%',
          }}
        >
          <a onClick={() => visualizeDataset(original, value)}>Visualize</a>
        </div>
      ),
    },
    {
      Header: 'Run Number',
      id: 'run_number',
      accessor: 'run_number',
      prefix_for_filtering: '',
      maxWidth: 90,
      resizable: false,
      Cell: ({ original, value }) => (
        <div style={{ textAlign: 'center', width: '100%' }}>
          <a onClick={() => showManageDatasetModal(original)}>{value}</a>
        </div>
      ),
    },
    {
      Header: 'Dataset Name',
      id: 'name',
      accessor: 'name',
      prefix_for_filtering: '',
      maxWidth: 250,
    },
    {
      Header: 'Class',
      id: 'class',
      accessor: 'class',
      prefix_for_filtering: 'rr_attributes',
      maxWidth: 90,
      Cell: ({ original }) => (
        <div style={{ textAlign: 'center' }}>
          {original.Run.rr_attributes.class}
        </div>
      ),
    },
    {
      Header: 'Manage / LS',
      id: 'manage',
      sortable: false,
      maxWidth: 75,
      Cell: ({ original }) => (
        <div style={{ textAlign: 'center' }}>
          <span>
            <a onClick={() => showManageDatasetModal(original)}>Manage</a>
            {' / '}
          </span>
          <a onClick={(evt) => showLumisectionModal(original)}>LS</a>
        </div>
      ),
    },
    {
      Header: 'Appeared In',
      id: 'appeared_in',
      accessor: 'appeared_in',
      prefix_for_filtering: 'dataset_attributes',
      maxWidth: 150,
      Cell: ({ original, value }) => (
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              fontSize: '0.95em',
              fontWeight: 'bold',
              borderRadius: '1px',
            }}
          >
            <span style={{ padding: '4px' }}>{value}</span>
          </span>
        </div>
      ),
    },
    {
      Header: `${workspace} State`,
      id: `${workspace.toLowerCase()}_state`,
      accessor: `${workspace.toLowerCase()}_state`,
      prefix_for_filtering: 'dataset_attributes',
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
              borderRadius: '1px',
            }}
          >
            <span style={{ padding: '4px' }}>{value}</span>
          </span>
        </div>
      ),
    },
    {
      Header: 'LS Duration',
      id: 'ls_duration',
      accessor: 'ls_duration',
      prefix_for_filtering: 'oms_attributes',
      maxWidth: 70,
      Cell: ({ original }) => (
        <div style={{ textAlign: 'center' }}>
          {original.Run.oms_attributes.ls_duration}
        </div>
      ),
    },
    // { Header: 'Dataset Created', accessor: 'createdAt', maxWidth: 150 }
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

  // Now add the ones in global:
  const global_columns = [];
  for (const [key, val] of Object.entries(certifiable_offline_components)) {
    val.forEach((sub_name) => {
      global_columns.push(`${key}-${sub_name}`);
    });
  }
  // all_columns_formatted are in the form of workspace-subcomponent like csc-efficiency
  let all_columns_formatted = [];
  workspaces.forEach(({ workspace, columns }) => {
    columns.forEach((column) => {
      const column_name = `${workspace}-${column}`;
      if (!global_columns.includes(column_name)) {
        all_columns_formatted.push(column_name);
      }
    });
  });

  all_columns_formatted = global_columns.concat(all_columns_formatted);
  // Put components in format Header: component
  let offline_columns_composed = [];
  if (workspace === 'global') {
    offline_columns_composed = global_columns.map((column) => ({
      accessor: column,
      Header: column.split('-')[1],
    }));
  } else {
    offline_columns_composed = all_columns_formatted
      .filter((column) => {
        return (
          column.startsWith(workspace.toLowerCase()) && column.includes('-')
        );
      })
      .map((column) => ({
        accessor: column,
        Header: column.split('-')[1],
      }));
  }

  offline_columns_composed = offline_columns_composed.map((column) => {
    return {
      ...column,
      maxWidth: 66,
      id: column.accessor,
      prefix_for_filtering: 'triplet_summary',
      accessor: (data) => {
        const triplet = data.triplet_summary[column['accessor']];
        return triplet;
      },
      Cell: ({ original, value }) => (
        <Status
          significant={true}
          triplet_summary={value}
          run_number={original.run_number}
          dataset_name={original.name}
          component={column['accessor']}
        />
      ),
    };
  });
  columns = [...columns, ...offline_columns_composed];
  // columns.push({
  //   Header: 'Cache',
  //   id: 'cache',
  //   filterable: false,
  //   sortable: false,
  //   Cell: ({ original }) => {
  //     const { run_number, name } = original;
  //     return (
  //       <div>
  //         <span>
  //           <a
  //             onClick={() =>
  //               reGenerateCache({
  //                 run_number,
  //                 dataset_name: name
  //               })
  //             }
  //           >
  //             Re-create cache
  //           </a>
  //         </span>
  //       </div>
  //     );
  //   }
  // });
  // columns = component_columns;

  return columns;
};
export default column_generator;
