// import React, { Component } from 'react';
// import {
//     Table,
//     Input,
//     Button,
//     Icon,
//     InputNumber,
//     Popconfirm,
//     Form,
//     Pagination
// } from 'antd';

// const data = [];
// for (let i = 316096; i < 316196; i++) {
//     data.push({
//         key: i.toString(),
//         number: i,
//         'lhc-fill': i % 100000,
//         name: `Edrward ${i}`,
//         address: `London Park no.`,
//         'b-field': 3.8005,
//         events: (Math.random() * 500000).toFixed(0),
//         started: 'Thu 10-05-18 17:59:43',
//         duration: '00:00:21:23',
//         class: ['Collisions', 'Cosmics', 'Commissioning'][
//             (Math.random() * 3).toFixed(0)
//         ]
//     });
// }
// const FormItem = Form.Item;
// const EditableContext = React.createContext();

// const EditableRow = ({ form, index, ...props }) => (
//     <EditableContext.Provider value={form}>
//         <tr {...props} />
//     </EditableContext.Provider>
// );

// const EditableFormRow = Form.create()(EditableRow);

// class EditableCell extends React.Component {
//     getInput = () => {
//         if (this.props.inputType === 'number') {
//             return <InputNumber size="small" />;
//         }
//         return <Input size="small" />;
//     };
//     onSearch = () => {
//         const { searchText } = this.state;
//         const reg = new RegExp(searchText, 'gi');
//         this.setState({
//             filterDropdownVisible: false,
//             filtered: !!searchText,
//             data: data
//                 .map(record => {
//                     const match = record.name.match(reg);
//                     if (!match) {
//                         return null;
//                     }
//                     return {
//                         ...record,
//                         name: (
//                             <span>
//                                 {record.name
//                                     .split(reg)
//                                     .map(
//                                         (text, i) =>
//                                             i > 0
//                                                 ? [
//                                                       <span className="highlight">
//                                                           {match[0]}
//                                                       </span>,
//                                                       text
//                                                   ]
//                                                 : text
//                                     )}
//                             </span>
//                         )
//                     };
//                 })
//                 .filter(record => !!record)
//         });
//     };

//     render() {
//         const {
//             editing,
//             dataIndex,
//             title,
//             inputType,
//             record,
//             index,
//             ...restProps
//         } = this.props;
//         return (
//             <EditableContext.Consumer>
//                 {form => {
//                     const { getFieldDecorator } = form;
//                     return (
//                         <td {...restProps}>
//                             {editing ? (
//                                 <FormItem>
//                                     {getFieldDecorator(dataIndex, {
//                                         rules: [
//                                             {
//                                                 required: true,
//                                                 message: `Please Input ${title}!`
//                                             }
//                                         ],
//                                         initialValue: record[dataIndex]
//                                     })(this.getInput())}
//                                 </FormItem>
//                             ) : (
//                                 restProps.children
//                             )}
//                         </td>
//                     );
//                 }}
//             </EditableContext.Consumer>
//         );
//     }
// }

// class EditableTable extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             data,
//             editingKey: '',
//             filterDropdownVisible: false,
//             searchText: '',
//             filtered: false
//         };
//         this.columns = [
//             {
//                 title: 'Number',
//                 dataIndex: 'number',
//                 editable: true,
//                 width: 80,
//                 fixed: 'left'
//             },
//             { title: 'LHC-Fill', dataIndex: 'lhc-fill', editable: true },
//             {
//                 title: 'Name',
//                 dataIndex: 'name',
//                 key: 'name',
//                 editable: true,
//                 filterDropdown: (
//                     <div className="custom-filter-dropdown">
//                         <Input
//                             ref={ele => (this.searchInput = ele)}
//                             placeholder="Search name"
//                             value={this.state.searchText}
//                             onChange={this.onInputChange}
//                             onPressEnter={this.onSearch}
//                         />
//                         <Button type="primary" onClick={this.onSearch}>
//                             Search
//                         </Button>
//                     </div>
//                 ),
//                 filterIcon: (
//                     <Icon
//                         type="search"
//                         style={{
//                             color: this.state.filtered ? '#108ee9' : '#aaa'
//                         }}
//                     />
//                 ),
//                 filterDropdownVisible: this.state.filterDropdownVisible,
//                 onFilterDropdownVisibleChange: visible => {
//                     this.setState(
//                         { filterDropdownVisible: visible },
//                         () => this.searchInput && this.searchInput.focus()
//                     );
//                 }
//             },
//             {
//                 title: 'B-field',
//                 dataIndex: 'b-field',
//                 key: 'b-field',
//                 editable: true,
//                 filters: [
//                     { text: 'London', value: 'London' },
//                     { text: 'New York', value: 'New York' }
//                 ],
//                 onFilter: (value, record) => record.address.indexOf(value) === 0
//             },
//             { title: 'Events', dataIndex: 'events', editable: false },
//             { title: 'Started', dataIndex: 'started', editable: false },
//             { title: 'Duration', dataIndex: 'duration', editable: false },
//             { title: 'CSC', dataIndex: ''}
//             { title: 'Class', dataIndex: 'class', editable: false },
//             {
//                 title: 'Operation',
//                 width: 90,
//                 dataIndex: 'operation',
//                 fixed: 'right',
//                 render: (text, record) => {
//                     const editable = this.isEditing(record);
//                     return (
//                         <div className="editable-row-operations">
//                             {editable ? (
//                                 <span>
//                                     <EditableContext.Consumer>
//                                         {form => (
//                                             <a
//                                                 href="javascript:;"
//                                                 onClick={() =>
//                                                     this.save(form, record.key)
//                                                 }
//                                             >
//                                                 Save
//                                             </a>
//                                         )}
//                                     </EditableContext.Consumer>
//                                     <Popconfirm
//                                         title="Sure to cancel?"
//                                         onConfirm={() =>
//                                             this.cancel(record.key)
//                                         }
//                                     >
//                                         <a>Cancel</a>
//                                     </Popconfirm>
//                                 </span>
//                             ) : (
//                                 <a onClick={() => this.edit(record.key)}>
//                                     Edit
//                                 </a>
//                             )}
//                         </div>
//                     );
//                 }
//             }
//         ];
//     }
//     onInputChange = e => {
//         this.setState({ searchText: e.target.value });
//     };
//     isEditing = record => {
//         return record.key === this.state.editingKey;
//     };
//     edit(key) {
//         this.setState({ editingKey: key });
//     }
//     save(from, key) {
//         from.validateFields((error, row) => {
//             if (error) {
//                 return;
//             }
//             const newData = [...this.state.data];
//             const index = newData.findIndex(item => key === item.key);
//             if (index > -1) {
//                 const item = newData[index];
//                 newData.splice(index, 1, {
//                     ...item,
//                     ...row
//                 });
//                 this.setState({ data: newData, editingKey: '' });
//             } else {
//                 newData.push(data);
//                 this.setState({ data: newData, editingKey: '' });
//             }
//         });
//     }
//     cancel = () => {
//         this.setState({ editingKey: '' });
//     };
//     render() {
//         const components = {
//             body: {
//                 row: EditableFormRow,
//                 cell: EditableCell
//             }
//         };

//         const columns = this.columns.map(col => {
//             if (!col.editable) {
//                 return col;
//             }
//             return {
//                 ...col,
//                 onCell: record => ({
//                     record,
//                     inputType: col.dataIndex === 'age' ? 'number' : 'text',
//                     dataIndex: col.dataIndex,
//                     title: col.title,
//                     editing: this.isEditing(record)
//                 })
//             };
//         });

//         const rowSelection = {
//             onChange: (selectedRowKeys, selectedRows) => {
//                 console.log(
//                     `selectedRowKeys: ${selectedRowKeys}`,
//                     'selectedRows: ',
//                     selectedRows
//                 );
//             },
//             getCheckboxProps: record => ({
//                 disabled: record.name === 'Disabled User', // Column configuration not to be checked
//                 name: record.name
//             })
//         };

//         return (
//             <div>
//                 <Table
//                     rowSelection={rowSelection}
//                     size="small"
//                     components={components}
//                     bordered
//                     dataSource={this.state.data}
//                     columns={columns}
//                     pagination={{
//                         size: 'small',
//                         total: 100,
//                         showSizeChanger: true,
//                         showQuickJumper: true,
//                         defaultPageSize: 13
//                     }}
//                     scroll={{ x: 1300 }}
//                 />
//                 <style jsx global>{`
//                     .ant-table-bordered .ant-table-thead > tr > th,
//                     .ant-table-bordered .ant-table-tbody > tr > td {
//                         border-right: 1px solid #e8e8e8 !important;
//                     }
//                 `}</style>
//             </div>
//         );
//     }
// }

// export default EditableTable;
