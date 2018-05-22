import React from 'react';
import { render } from 'react-dom';
import _ from 'lodash';
import { makeData, Logo, Tips } from './Utils';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const rawData = makeData();

const requestData = (pageSize, page, sorted, filtered) => {
    return new Promise((resolve, reject) => {
        // You can retrieve your data however you want, in this case, we will just use some local data.
        let filteredData = rawData;

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

        // You must return an object containing the rows of the current page, and optionally the total pages number.
        const res = {
            rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
            pages: Math.ceil(filteredData.length / pageSize)
        };

        // Here we'll simulate a server response with 500ms of delay.
        setTimeout(() => resolve(res), 500);
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
        return (
            <div>
                <ReactTable
                    columns={[
                        {
                            Header: 'Number',
                            accessor: 'number'
                        },
                        {
                            Header: 'LHC Fill',
                            accessor: 'lhc-fill'
                        },
                        {
                            Header: 'B1 stable',
                            accessor: 'b1-stable'
                        },
                        {
                            Header: 'B2 stable',
                            accessor: 'b2-stable'
                        },
                        {
                            Header: 'B-Field',
                            accessor: 'b-field'
                        },
                        {
                            Header: 'Events',
                            accessor: 'events'
                        },
                        {
                            Header: 'Started',
                            accessor: 'started'
                        },
                        {
                            Header: 'Stopped',
                            accessor: 'stopped'
                        },
                        {
                            Header: 'Duration',
                            accessor: 'duration'
                        },
                        {
                            Header: 'Hlt Key Description',
                            accessor: 'hlt-key-description'
                        },
                        {
                            Header: 'Class',
                            accessor: 'class'
                        },
                        {
                            Header: 'TIBTID on',
                            accessor: 'TIBTID-on'
                        },
                        {
                            Header: 'TEC+ on',
                            accessor: 'TEC+-on'
                        },
                        {
                            Header: 'TEC- on',
                            accessor: 'TEC--on'
                        },
                        {
                            Header: 'FPIX on',
                            accessor: 'FPix-on'
                        },
                        {
                            Header: 'BPIX on',
                            accessor: 'BPix-on'
                        },
                        {
                            Header: 'RPC on',
                            accessor: 'RPC-on'
                        },
                        {
                            Header: 'CSC+ on',
                            accessor: 'CSC+-on'
                        },
                        {
                            Header: 'CSC- on',
                            accessor: 'CSC--on'
                        },
                        {
                            Header: 'CSC in',
                            accessor: 'CSC-in'
                        },
                        {
                            Header: 'DT+ on',
                            accessor: 'DT+-on'
                        },
                        {
                            Header: 'DT- on',
                            accessor: 'DT--on'
                        },
                        {
                            Header: 'DT0 on',
                            accessor: 'DT0-on'
                        },
                        {
                            Header: 'DT in',
                            accessor: 'DT-in'
                        },
                        {
                            Header: 'RPC in',
                            accessor: 'RPC-in'
                        }
                    ]}
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
                    filterable
                    defaultPageSize={
                        20 // Request new data when things change
                    }
                    className="-striped -highlight"
                />
                <br />
                {/* <Tips /> */}
                {/* <Logo /> */}
            </div>
        );
    }
}

export default App;
