import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { render } from 'react-dom';
import { Icon } from 'antd';
import _ from 'lodash';
import { makeData, Logo, Tips } from './Utils';
import { ROOT_URL } from '../../../ducks/rootReducer';
import { toggleTableFilters } from '../../../ducks/online/ui';
import runs from '../../../ducks/runs.json';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

let rawData = [];

const requestData = (pageSize, page, sorted, filtered) => {
    console.log(pageSize, page, sorted, filtered);
    return new Promise((resolve, reject) => {
        // You can retrieve your data however you want, in this case, we will just use some local data.
        let filteredData = rawData;
        console.log(filteredData);

        // You can use the filters in your request, but you are responsible for applying them.
        if (filtered.length) {
            filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
                return filteredSoFar.filter(row => {
                    return (row[nextFilter.id] + '').includes(nextFilter.value);
                });
            }, filteredData);
        }
        // You can also use the sorting in your request, but again, you are responsible for applying it.
        const sortedData = _.orderBy(
            filteredData,
            sorted.map(sort => {
                return row => {
                    if (row[sort.id] === null || row[sort.id] === undefined) {
                        return -Infinity;
                    }
                    return typeof row[sort.id] === 'string'
                        ? row[sort.id].toLowerCase()
                        : row[sort.id];
                };
            }),
            sorted.map(d => (d.desc ? 'desc' : 'asc'))
        );

        if (rawData.length === 0) {
            // axios.get(`${ROOT_URL}/online/runs`).then(res => {
            // rawData = res.data;
            console.log(runs);
            rawData = runs;
            resolve({
                rows: rawData.slice(
                    pageSize * page,
                    pageSize * page + pageSize
                ),
                pages: Math.ceil(filteredData.length / pageSize)
                // });
            });
        } else {
            // You must return an object containing the rows of the current page, and optionally the total pages number.
            const res = {
                rows: sortedData.slice(
                    pageSize * page,
                    pageSize * page + pageSize
                ),
                pages: Math.ceil(filteredData.length / pageSize)
            };

            // Here we'll simulate a server response with 500ms of delay.
            setTimeout(() => resolve(res), 500);
        }
    });
};

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            pages: null,
            loading: true
        };
        this.fetchData = this.fetchData.bind(this);
    }
    fetchData(state, instance) {
        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        this.setState({ loading: true });
        // Request the data however you want.  Here, we'll use our mocked service we created earlier
        requestData(
            state.pageSize,
            state.page,
            state.sorted,
            state.filtered
        ).then(res => {
            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
            this.setState({
                data: res.rows,
                pages: res.pages,
                loading: false
            });
        });
    }
    render() {
        const { data, pages, loading } = this.state;
        const { filterable } = this.props;
        let columns = [
            {
                Header: 'Number',
                accessor: 'RUNNUMBER'
            },
            { Header: 'LHC Fill', accessor: 'LHCFILL' },
            { Header: 'B1 stable', accessor: 'BEAM1_STABLE' },
            { Header: 'B2 stable', accessor: 'BEAM2_STABLE' },
            { Header: 'B-Field', accessor: 'BFIELD' },
            { Header: 'Events', accessor: 'EVENTS' },
            { Header: 'Started', accessor: 'STARTTIME' },
            { Header: 'Stopped', accessor: 'STOPTIME' },
            { Header: 'Duration', accessor: 'duration' },
            {
                Header: 'Hlt Key Description',
                accessor: 'HLTKEYDESCRIPTION'
            },
            { Header: 'Class', accessor: 'class' },
            { Header: 'TIBTID on', accessor: 'TIBTID_READY' },
            { Header: 'TEC+ on', accessor: 'TECP_READY' },
            { Header: 'TEC- on', accessor: 'TECM_READY' },
            { Header: 'FPIX on', accessor: 'FPIX_READY' },
            { Header: 'BPIX on', accessor: 'BPIX_READY' },
            { Header: 'RPC on', accessor: 'RPC_READY' },
            { Header: 'CSC+ on', accessor: 'CSCP_READY' },
            { Header: 'CSC- on', accessor: 'CSCM_READY' },
            { Header: 'CSC in', accessor: 'CSC_PRESENT' },
            { Header: 'DT+ on', accessor: 'DTP_READY' },
            { Header: 'DT- on', accessor: 'DTM_READY' },
            { Header: 'DT0 on', accessor: 'DT0_READY' },
            { Header: 'DT in', accessor: 'DT_PRESENT' },
            { Header: 'RPC in', accessor: 'RPC_PRESENT' }
        ];
        columns = columns.map(column => {
            return {
                ...column,
                Header: () => (
                    <div>
                        {column.Header}&nbsp;&nbsp;
                        <Icon
                            onClick={() => this.props.toggleTableFilters()}
                            type="search"
                            style={{ fontSize: '10px' }}
                        />
                    </div>
                )
            };
        });
        return (
            <div>
                <ReactTable
                    columns={columns}
                    manual
                    data={
                        data // Forces table not to paginate or sort automatically, so we can handle it server-side
                    }
                    pages={pages}
                    loading={
                        loading // Display the total number of pages
                    }
                    onFetchData={
                        this.fetchData // Display the loading overlay when we need it
                    }
                    filterable={filterable}
                    defaultPageSize={
                        20 // Request new data when things change
                    }
                    className="-striped -highlight"
                />
                <br />
                {/* <Tips /> */}
                {/* <Logo /> */}
                <style jsx global>{`
                    .ReactTable .rt-th,
                    .ReactTable .rt-td {
                        font-size: 11px;
                        padding: 3px 5px;
                    }
                `}</style>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        filterable: state.online.ui.table.filterable
    };
};

export default connect(
    mapStateToProps,
    { toggleTableFilters }
)(App);
