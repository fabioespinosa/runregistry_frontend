import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { AutoComplete, Menu, Button, Input } from 'antd';
import {
  PlusCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Swal from 'sweetalert2';
import {
  calculateJson,
  changeJsonLogic,
  getJsonConfigurations,
  resetJson,
  addConfiguration,
  editConfiguration,
  deleteJsonConfiguration,
} from '../../../../ducks/json/configuration';
import { hideModal } from '../../../../ducks/json/ui';
import stringify from 'json-stringify-pretty-compact';
import swal from 'sweetalert2';

const { SubMenu } = Menu;

const TextEditor = dynamic(
  import('../../../common/ClassifierEditor/JSONEditor/JSONEditor'),
  {
    ssr: false,
  }
);

class Configuration extends Component {
  state = {
    menu_selection: 'golden',
    editing: false,
    creating: false,
    new_name: '',
    run_list: false,
    dataset_name_filter: '',
  };

  async componentDidMount() {
    await this.props.getJsonConfigurations();
    const default_selection = this.state.menu_selection;
    this.handleMenuChange(default_selection);
  }
  handleMenuChange = (new_menu_selection) => {
    if (!new_menu_selection) {
      new_menu_selection = 'golden';
    }
    this.props.resetJson();
    this.setState({ menu_selection: new_menu_selection });
    const json_logic = this.props.json_configurations[new_menu_selection];
    const formatted = stringify(json_logic);
    this.changeValue(formatted);
  };

  createNewConfiguration = async (new_configuration) => {
    new_configuration = JSON.parse(new_configuration);
    const { new_name } = this.state;
    await this.props.addConfiguration(new_configuration, new_name);
    await this.props.getJsonConfigurations();
    this.setState({ creating: false });
    this.handleMenuChange(new_name);
    await Swal(`New Configuration ${new_name} added`, '', 'success');
  };

  editConfiguration = async (new_configuration) => {
    new_configuration = JSON.parse(new_configuration);
    const { menu_selection } = this.state;
    const { json_configurations_array } = this.props;
    const selected = json_configurations_array.find(
      ({ name }) => name === menu_selection
    );
    selected.classifier = new_configuration;
    await this.props.editConfiguration(selected, menu_selection);
    await this.props.getJsonConfigurations();
    this.setState({ editing: false });
    this.handleMenuChange(menu_selection);
    await Swal(`Configuration ${menu_selection} edited`, '', 'success');
  };

  deleteConfiguration = async () => {
    const { menu_selection } = this.state;
    if (menu_selection === 'golden') {
      return await Swal('Cannot delete golden configuration', '', 'warning');
    }
    const { json_configurations_array } = this.props;
    const selected = json_configurations_array.find(
      ({ name }) => name === menu_selection
    );
    const { value } = await Swal({
      type: 'warning',
      title: `Are you sure you want to delete ${menu_selection} JSON configuration`,
      text: '',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      reverseButtons: true,
    });
    if (value) {
      await this.props.deleteJsonConfiguration(selected.id);
      await Swal(`Configuration deleted`, '', 'success');
      await this.props.getJsonConfigurations();
      this.handleMenuChange(); // It will select golden by default
    }
  };

  changeValue = (new_configuration) => {
    this.props.changeJsonLogic(new_configuration);
  };

  getDisplayedJSON(json) {
    return stringify(json);
  }

  toggleCreationMode = () => {
    this.props.resetJson();
    this.setState({ creating: !this.state.creating });
  };

  toggleEditionMode = () => {
    this.props.resetJson();
    this.setState({ editing: !this.state.editing });
  };

  addNewConfigurationInput = () => (
    <div className="creating_menu">
      <Input
        onChange={({ target }) =>
          this.setState({
            new_name: target.value,
          })
        }
        placeholder="Enter the name of the new configuration"
      />
      <Button onClick={this.toggleCreationMode}>
        <CloseCircleOutlined />
      </Button>
      <style jsx>{`
        .creating_menu > :global(.ant-input) {
          width: 80%;
        }
      `}</style>
    </div>
  );

  getRunList = (current_json) => {
    const runs = [];
    for (const [key, val] of Object.entries(current_json)) {
      runs.push(+key);
    }
    return runs;
  };

  renderTitle = (title) => {
    return <span>{title}</span>;
  };

  renderItem = (title, label) => {
    return {
      value: title,
      label: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {title}
          <span>{label}</span>
        </div>
      ),
    };
  };

  render() {
    const {
      json_configurations,
      json_configurations_array,
      calculateJson,
      current_json,
      json_logic,
      number_of_runs,
      number_of_lumisections,
      hideModal,
    } = this.props;
    const {
      creating,
      menu_selection,
      editing,
      dataset_name_filter,
    } = this.state;
    const download_string =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(this.getDisplayedJSON(current_json));

    const options = [
      {
        label: this.renderTitle('Unique dataset name'),
        options: [this.renderItem('/PromptReco/Collisions2018A/DQM')],
      },
      {
        label: this.renderTitle(
          'Partial dataset name (for example, to include all eras)'
        ),
        options: [
          this.renderItem(
            '/PromptReco/Collisions2018_/DQM',
            'The _ is a wildcard for any character (in this case all eras)'
          ),
        ],
      },
      {
        label: this.renderTitle(
          'Only certain characters (for example to include certain eras)'
        ),
        options: [
          this.renderItem(
            '/PromptReco/Collisions2018(A|B)/DQM',
            'The (A|B) works as a filter for era A or era B'
          ),
        ],
      },
      {
        label: this.renderTitle(
          'Partial dataset name (incomplete start or end)'
        ),
        options: [
          this.renderItem(
            '%PromptReco/Collisions%',
            'The % is a wildcard for 1 or more characters'
          ),
        ],
      },
    ];
    return (
      <div className="configuration">
        <div className="editor">
          <center>
            <div>
              <h4>
                Enter the dataset of the runs you want to create a json from:
              </h4>
              <AutoComplete
                dropdownClassName="certain-category-search-dropdown"
                dropdownMatchSelectWidth={650}
                style={{ width: 800 }}
                options={options}
                onChange={(dataset_name_filter) =>
                  this.setState({ dataset_name_filter })
                }
              >
                <Input
                  size="large"
                  placeholder="Enter the dataset name (e.g. /PromptReco/HICosmics18_/DQM)"
                  onChange={(e) =>
                    this.setState({ dataset_name_filter: e.target.value })
                  }
                />
              </AutoComplete>
              <br />
            </div>
          </center>
          <br />
          {creating ? (
            this.addNewConfigurationInput()
          ) : (
            <center>
              <Menu
                onClick={({ key }) => this.handleMenuChange(key)}
                selectedKeys={[menu_selection]}
                mode="horizontal"
              >
                {json_configurations_array.map(({ name }) => (
                  <Menu.Item key={name}>{name}</Menu.Item>
                ))}
                <Menu.Item key="arbitrary">arbitrary configuration</Menu.Item>
                <Button
                  type="link"
                  onClick={this.toggleCreationMode}
                  icon={<PlusCircleOutlined />}
                />
              </Menu>
            </center>
          )}
          {menu_selection !== 'arbitrary' && !creating && !editing && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '10px',
              }}
            >
              <Button
                type="link"
                onClick={this.toggleEditionMode}
                icon={<EditOutlined />}
              />
              &nbsp;
              <Button
                type="link"
                onClick={this.deleteConfiguration}
                icon={<DeleteOutlined />}
              />
            </div>
          )}
          {editing && (
            <div>
              <span>
                You are now editing the <strong>{menu_selection}</strong> JSON
                configuration, edit below and then click 'Edit configuration'
                (below)
              </span>{' '}
              &nbsp;
              <Button onClick={this.toggleEditionMode}>
                <CloseCircleOutlined />
              </Button>
            </div>
          )}
          {menu_selection === 'arbitrary' && (
            <h3>Insert JSON-logic to generate arbitrary json:</h3>
          )}
          {creating && (
            <p>
              Enter name of new configuration and enter JSON logic below, then
              click save (below)
            </p>
          )}
          <br />
          <TextEditor
            onChange={this.changeValue}
            value={json_logic}
            lan="javascript"
            theme="github"
          />
          <br />
          <center>
            <div className="generate_button">
              {creating ? (
                <Button
                  type="primary"
                  onClick={() => this.createNewConfiguration(json_logic)}
                >
                  Save new configuration
                </Button>
              ) : editing ? (
                <Button
                  type="dashed"
                  onClick={() => this.editConfiguration(json_logic)}
                >
                  Edit configuration
                </Button>
              ) : (
                <div>
                  <Button
                    type="primary"
                    onClick={async () => {
                      const id = await calculateJson(
                        json_logic,
                        dataset_name_filter
                      );
                      hideModal();
                      await Swal({
                        type: 'success',
                        title: `JSON job ${id} received, it is being generated now`,
                        html: `Your JSON will take approx. 5 minutes to generate, you can see it with the id: <strong>${id}</strong> on the list.`,
                      });
                    }}
                  >
                    Generate JSON
                  </Button>
                </div>
              )}
            </div>
          </center>
        </div>

        <style jsx>{`
          .configuration {
            display: flex;
          }
          .editor {
            width: 100%;
          }
        `}</style>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    json_configurations: state.json.configuration.json_configurations,
    json_configurations_array:
      state.json.configuration.json_configurations_array,
    current_json: state.json.configuration.current_json,
    json_logic: state.json.configuration.json_logic,
    number_of_runs: state.json.configuration.number_of_runs,
    number_of_lumisections: state.json.configuration.number_of_lumisections,
  };
}

export default connect(mapStateToProps, {
  calculateJson,
  changeJsonLogic,
  getJsonConfigurations,
  resetJson,
  addConfiguration,
  editConfiguration,
  deleteJsonConfiguration,
  hideModal,
})(Configuration);
