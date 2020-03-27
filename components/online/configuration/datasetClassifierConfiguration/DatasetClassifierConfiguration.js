import React, { Component } from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import ReactTable from 'react-table';
import { Input, Select } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import {
  fetchDatasetClassifiers,
  deleteDatasetClassifier,
  editDatasetClassifier,
  newDatasetClassifier
} from '../../../../ducks/online/classifiers/dataset';
import {
  editClassifierIntent,
  changeJsonEditorValue
} from '../../../../ducks/classifier_editor';
import stringify from 'json-stringify-pretty-compact';
const { Option } = Select;

const Editor = dynamic(
  import('../../../common/ClassifierEditor/ClassifierEditor'),
  {
    ssr: false
  }
);

class DatasetClassifierConfiguration extends Component {
  state = { class_selected: '', is_editing: false };
  componentDidMount() {
    this.props.fetchDatasetClassifiers();
  }

  getDisplayedClassifier = classifier => {
    if (typeof classifier === 'string') {
      classifier = JSON.parse(classifier);
    }
    const displayed_text = classifier.if[0];
    return stringify(displayed_text);
  };

  formatClassifierCorrectly = inside_input => {
    const parsed_input = JSON.parse(inside_input);
    let classifier = {
      if: [parsed_input, true, false]
    };
    return classifier;
  };

  render() {
    const {
      newDatasetClassifier,
      editDatasetClassifier,
      editClassifierIntent,
      changeJsonEditorValue,
      deleteDatasetClassifier,
      classifiers
    } = this.props;
    const { class_selected } = this.state;
    const columns = [
      {
        Header: 'Class',
        accessor: 'class',
        width: 90,
        getProps: () => ({ style: { textAlign: 'center' } })
      },
      {
        Header: 'Enabled',
        accessor: 'enabled',
        width: 80,
        Cell: row => (
          <div style={{ textAlign: 'center' }}>
            {row.value ? (
              <CheckCircleOutlined
                style={{
                  fontSize: 15,
                  margin: '0 auto',
                  color: 'green'
                }}
              />
            ) : (
              <CloseCircleOutlined
                style={{
                  fontSize: 15,
                  margin: '0 auto',
                  color: 'red'
                }}
              />
            )}
          </div>
        )
      },
      {
        Header: 'JSON string',
        accessor: 'classifier',
        width: 250,
        Cell: row => {
          const displayed_text = this.getDisplayedClassifier(row.value);
          return <span>{displayed_text}</span>;
        }
      },
      { Header: 'Created at', accessor: 'createdAt', width: 100 },
      { Header: 'Updated at', accessor: 'updatedAt', width: 100 },
      {
        Header: 'Edit',
        width: 100,
        Cell: row => (
          <div style={{ textAlign: 'center' }}>
            <a
              onClick={() => {
                this.setState({
                  class_selected: row.original.class,
                  is_editing: true
                });
                const classifier = this.getDisplayedClassifier(
                  row.original.classifier
                );
                editClassifierIntent(row.original);
                changeJsonEditorValue(classifier);
              }}
            >
              Edit
            </a>
          </div>
        )
      },
      {
        Header: 'Delete',
        width: 100,
        Cell: row => (
          <div style={{ textAlign: 'center' }}>
            <a
              onClick={async () => {
                const { value } = await Swal({
                  type: 'warning',
                  title:
                    'Are you sure you want to delete this Dataset classifier',
                  text: '',
                  showCancelButton: true,
                  confirmButtonText: 'Yes',
                  reverseButtons: true
                });
                if (value) {
                  await deleteDatasetClassifier(row.original.id);
                  await Swal(`Classifier deleted`, '', 'success');
                }
              }}
            >
              Delete
            </a>
          </div>
        )
      }
    ];
    return (
      <div>
        <p>Current Dataset Classifier criteria:</p>
        <ReactTable
          columns={columns}
          data={classifiers}
          defaultPageSize={10}
          showPagination={classifiers.length > 10}
          optionClassName="react-table"
        />
        <Editor
          formatClassifierCorrectly={this.formatClassifierCorrectly}
          editClassifier={valid_js_object => {
            editDatasetClassifier(valid_js_object, class_selected);
            this.setState({
              is_editing: false,
              class_selected: ''
            });
          }}
          newClassifier={valid_js_object =>
            newDatasetClassifier(valid_js_object, class_selected)
          }
          onCancel={() => {
            this.setState({ is_editing: false });
          }}
        >
          {this.state.is_editing ? (
            <div>
              Editing classifier for class{' '}
              <strong>{this.state.class_selected}</strong>
            </div>
          ) : (
            <div className="class_name_input">
              <Input
                addonBefore="New Dataset Classifier for the run's of class:"
                placeholder="Insert class name"
                onChange={evt =>
                  this.setState({
                    class_selected: evt.target.value
                  })
                }
              />
            </div>
          )}
        </Editor>
        <style jsx>{`
          .class_name_input {
            width: 500px;
          }
        `}</style>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    classifiers: state.online.classifiers.dataset
  };
};

export default connect(mapStateToProps, {
  fetchDatasetClassifiers,
  deleteDatasetClassifier,
  editDatasetClassifier,
  newDatasetClassifier,
  changeJsonEditorValue,
  editClassifierIntent
})(DatasetClassifierConfiguration);
