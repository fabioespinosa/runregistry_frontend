module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./components/home/run_table/RunTable.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_antd_lib_table_style_css__ = __webpack_require__("antd/lib/table/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_antd_lib_table_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_antd_lib_table_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_antd_lib_table__ = __webpack_require__("antd/lib/table");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_antd_lib_table___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_antd_lib_table__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_antd_lib_popconfirm_style_css__ = __webpack_require__("antd/lib/popconfirm/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_antd_lib_popconfirm_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_antd_lib_popconfirm_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_antd_lib_popconfirm__ = __webpack_require__("antd/lib/popconfirm");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_antd_lib_popconfirm___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_antd_lib_popconfirm__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_antd_lib_icon_style_css__ = __webpack_require__("antd/lib/icon/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_antd_lib_icon_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_antd_lib_icon_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_antd_lib_icon__ = __webpack_require__("antd/lib/icon");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_antd_lib_icon___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_antd_lib_icon__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_antd_lib_button_style_css__ = __webpack_require__("antd/lib/button/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_antd_lib_button_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_antd_lib_button_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_antd_lib_button__ = __webpack_require__("antd/lib/button");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_antd_lib_button___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_antd_lib_button__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_antd_lib_input_style_css__ = __webpack_require__("antd/lib/input/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_antd_lib_input_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_antd_lib_input_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_antd_lib_input__ = __webpack_require__("antd/lib/input");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_antd_lib_input___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_antd_lib_input__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_antd_lib_input_number_style_css__ = __webpack_require__("antd/lib/input-number/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_antd_lib_input_number_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_antd_lib_input_number_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_antd_lib_input_number__ = __webpack_require__("antd/lib/input-number");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_antd_lib_input_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_antd_lib_input_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_antd_lib_form_style_css__ = __webpack_require__("antd/lib/form/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_antd_lib_form_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_antd_lib_form_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_antd_lib_form__ = __webpack_require__("antd/lib/form");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_antd_lib_form___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_antd_lib_form__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_react__);














var _jsxFileName = "/Users/fabioespinosa/Desktop/runregistry/components/home/run_table/RunTable.js";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }


var data = [];

for (var i = 30000; i < 30100; i++) {
  data.push({
    key: i.toString(),
    name: "Edrward ".concat(i),
    number: i,
    address: "London Park no.",
    'b-field': 3.8005,
    events: (Math.random() * 500000).toFixed(0)
  });
}

var FormItem = __WEBPACK_IMPORTED_MODULE_13_antd_lib_form___default.a.Item;
var EditableContext = __WEBPACK_IMPORTED_MODULE_14_react___default.a.createContext();

var EditableRow = function EditableRow(_ref) {
  var form = _ref.form,
      index = _ref.index,
      props = _objectWithoutProperties(_ref, ["form", "index"]);

  return __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement(EditableContext.Provider, {
    value: form,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    }
  }, __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement("tr", _extends({}, props, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    }
  })));
};

var EditableFormRow = __WEBPACK_IMPORTED_MODULE_13_antd_lib_form___default.a.create()(EditableRow);

var EditableCell =
/*#__PURE__*/
function (_React$Component) {
  _inherits(EditableCell, _React$Component);

  function EditableCell() {
    var _ref2;

    var _temp, _this;

    _classCallCheck(this, EditableCell);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_ref2 = EditableCell.__proto__ || Object.getPrototypeOf(EditableCell)).call.apply(_ref2, [this].concat(args))), Object.defineProperty(_assertThisInitialized(_this), "getInput", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        if (_this.props.inputType === 'number') {
          return __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_11_antd_lib_input_number___default.a, {
            size: "small",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 37
            }
          });
        }

        return __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_antd_lib_input___default.a, {
          size: "small",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 39
          }
        });
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "onSearch", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        var searchText = _this.state.searchText;
        var reg = new RegExp(searchText, 'gi');

        _this.setState({
          filterDropdownVisible: false,
          filtered: !!searchText,
          data: data.map(function (record) {
            var match = record.name.match(reg);

            if (!match) {
              return null;
            }

            return _objectSpread({}, record, {
              name: __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement("span", {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 56
                }
              }, record.name.split(reg).map(function (text, i) {
                return i > 0 ? [__WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement("span", {
                  className: "highlight",
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 63
                  }
                }, match[0]), text] : text;
              }))
            });
          }).filter(function (record) {
            return !!record;
          })
        });
      }
    }), _temp));
  }

  _createClass(EditableCell, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          editing = _props.editing,
          dataIndex = _props.dataIndex,
          title = _props.title,
          inputType = _props.inputType,
          record = _props.record,
          index = _props.index,
          restProps = _objectWithoutProperties(_props, ["editing", "dataIndex", "title", "inputType", "record", "index"]);

      return __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement(EditableContext.Consumer, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 89
        }
      }, function (form) {
        var getFieldDecorator = form.getFieldDecorator;
        return __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement("td", _extends({}, restProps, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 93
          }
        }), editing ? __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement(FormItem, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 95
          }
        }, getFieldDecorator(dataIndex, {
          rules: [{
            required: true,
            message: "Please Input ".concat(title, "!")
          }],
          initialValue: record[dataIndex]
        })(_this2.getInput())) : restProps.children);
      });
    }
  }]);

  return EditableCell;
}(__WEBPACK_IMPORTED_MODULE_14_react___default.a.Component);

var EditableTable =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(EditableTable, _React$Component2);

  function EditableTable(props) {
    var _this3;

    _classCallCheck(this, EditableTable);

    _this3 = _possibleConstructorReturn(this, (EditableTable.__proto__ || Object.getPrototypeOf(EditableTable)).call(this, props));
    Object.defineProperty(_assertThisInitialized(_this3), "onInputChange", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(e) {
        _this3.setState({
          searchText: e.target.value
        });
      }
    });
    Object.defineProperty(_assertThisInitialized(_this3), "isEditing", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(record) {
        return record.key === _this3.state.editingKey;
      }
    });
    Object.defineProperty(_assertThisInitialized(_this3), "cancel", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        _this3.setState({
          editingKey: ''
        });
      }
    });
    _this3.state = {
      data: data,
      editingKey: '',
      filterDropdownVisible: false,
      searchText: '',
      filtered: false
    };
    _this3.columns = [{
      title: 'Number',
      dataIndex: 'number',
      editable: true
    }, {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      filterDropdown: __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement("div", {
        className: "custom-filter-dropdown",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 139
        }
      }, __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_antd_lib_input___default.a, {
        ref: function ref(ele) {
          return _this3.searchInput = ele;
        },
        placeholder: "Search name",
        value: _this3.state.searchText,
        onChange: _this3.onInputChange,
        onPressEnter: _this3.onSearch,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 140
        }
      }), __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7_antd_lib_button___default.a, {
        type: "primary",
        onClick: _this3.onSearch,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 147
        }
      }, "Search")),
      filterIcon: __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5_antd_lib_icon___default.a, {
        type: "search",
        style: {
          color: _this3.state.filtered ? '#108ee9' : '#aaa'
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 153
        }
      }),
      filterDropdownVisible: _this3.state.filterDropdownVisible,
      onFilterDropdownVisibleChange: function onFilterDropdownVisibleChange(visible) {
        _this3.setState({
          filterDropdownVisible: visible
        }, function () {
          return _this3.searchInput && _this3.searchInput.focus();
        });
      }
    }, {
      title: 'B-field',
      dataIndex: 'b-field',
      key: 'b-field',
      editable: true,
      filters: [{
        text: 'London',
        value: 'London'
      }, {
        text: 'New York',
        value: 'New York'
      }],
      onFilter: function onFilter(value, record) {
        return record.address.indexOf(value) === 0;
      }
    }, {
      title: 'Events',
      dataIndex: 'events',
      editable: true
    }, {
      title: 'operation',
      dataIndex: 'operation',
      render: function render(text, record) {
        var editable = _this3.isEditing(record);

        return __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement("div", {
          className: "editable-row-operations",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 198
          }
        }, editable ? __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement("span", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 200
          }
        }, __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement(EditableContext.Consumer, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 201
          }
        }, function (form) {
          return __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement("a", {
            href: "javascript:;",
            onClick: function onClick() {
              return _this3.save(form, record.key);
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 203
            }
          }, "Save");
        }), __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_popconfirm___default.a, {
          title: "Sure to cancel?",
          onConfirm: function onConfirm() {
            return _this3.cancel(record.key);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 213
          }
        }, __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement("a", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 219
          }
        }, "Cancel"))) : __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement("a", {
          onClick: function onClick() {
            return _this3.edit(record.key);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 223
          }
        }, "Edit"));
      }
    }];
    return _this3;
  }

  _createClass(EditableTable, [{
    key: "edit",
    value: function edit(key) {
      this.setState({
        editingKey: key
      });
    }
  }, {
    key: "save",
    value: function save(from, key) {
      var _this4 = this;

      from.validateFields(function (error, row) {
        if (error) {
          return;
        }

        var newData = _toConsumableArray(_this4.state.data);

        var index = newData.findIndex(function (item) {
          return key === item.key;
        });

        if (index > -1) {
          var item = newData[index];
          newData.splice(index, 1, _objectSpread({}, item, row));

          _this4.setState({
            data: newData,
            editingKey: ''
          });
        } else {
          newData.push(data);

          _this4.setState({
            data: newData,
            editingKey: ''
          });
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var components = {
        body: {
          row: EditableFormRow,
          cell: EditableCell
        }
      };
      var columns = this.columns.map(function (col) {
        if (!col.editable) {
          return col;
        }

        return _objectSpread({}, col, {
          onCell: function onCell(record) {
            return {
              record: record,
              inputType: col.dataIndex === 'age' ? 'number' : 'text',
              dataIndex: col.dataIndex,
              title: col.title,
              editing: _this5.isEditing(record)
            };
          }
        });
      });
      var rowSelection = {
        onChange: function onChange(selectedRowKeys, selectedRows) {
          console.log("selectedRowKeys: ".concat(selectedRowKeys), 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: function getCheckboxProps(record) {
          return {
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name
          };
        }
      };
      return __WEBPACK_IMPORTED_MODULE_14_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_antd_lib_table___default.a, {
        rowSelection: rowSelection,
        size: "small",
        components: components,
        bordered: true,
        dataSource: this.state.data,
        columns: columns,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 304
        }
      });
    }
  }]);

  return EditableTable;
}(__WEBPACK_IMPORTED_MODULE_14_react___default.a.Component);

/* harmony default export */ __webpack_exports__["a"] = (EditableTable);

/***/ }),

/***/ "./components/ui/breadcrumb/Breadcrumb.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_antd_lib_breadcrumb_style_css__ = __webpack_require__("antd/lib/breadcrumb/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_antd_lib_breadcrumb_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_antd_lib_breadcrumb_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_antd_lib_breadcrumb__ = __webpack_require__("antd/lib/breadcrumb");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_antd_lib_breadcrumb___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_antd_lib_breadcrumb__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);


var _jsxFileName = "/Users/fabioespinosa/Desktop/runregistry/components/ui/breadcrumb/Breadcrumb.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var BreadcrumbCmp =
/*#__PURE__*/
function (_Component) {
  _inherits(BreadcrumbCmp, _Component);

  function BreadcrumbCmp() {
    _classCallCheck(this, BreadcrumbCmp);

    return _possibleConstructorReturn(this, (BreadcrumbCmp.__proto__ || Object.getPrototypeOf(BreadcrumbCmp)).apply(this, arguments));
  }

  _createClass(BreadcrumbCmp, [{
    key: "render",
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_antd_lib_breadcrumb___default.a, {
        style: {
          margin: '16px 0'
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 7
        }
      }, __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_antd_lib_breadcrumb___default.a.Item, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 8
        }
      }, "Online"), __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_antd_lib_breadcrumb___default.a.Item, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 9
        }
      }, "Runs"), __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_antd_lib_breadcrumb___default.a.Item, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 10
        }
      }, "All"));
    }
  }]);

  return BreadcrumbCmp;
}(__WEBPACK_IMPORTED_MODULE_2_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = (BreadcrumbCmp);

/***/ }),

/***/ "./components/ui/nav/Nav.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_antd_lib_menu_style_css__ = __webpack_require__("antd/lib/menu/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_antd_lib_menu_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_antd_lib_menu_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_antd_lib_menu__ = __webpack_require__("antd/lib/menu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_antd_lib_menu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_antd_lib_menu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_antd_lib_layout_style_css__ = __webpack_require__("antd/lib/layout/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_antd_lib_layout_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_antd_lib_layout_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_antd_lib_layout__ = __webpack_require__("antd/lib/layout");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_antd_lib_layout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_antd_lib_layout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__top_TopNav__ = __webpack_require__("./components/ui/nav/top/TopNav.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__side_SideNav__ = __webpack_require__("./components/ui/nav/side/SideNav.js");




var _jsxFileName = "/Users/fabioespinosa/Desktop/runregistry/components/ui/nav/Nav.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }


// import cms_logo from '../../../static/images/cms_logo.png';


var Header = __WEBPACK_IMPORTED_MODULE_3_antd_lib_layout___default.a.Header,
    Content = __WEBPACK_IMPORTED_MODULE_3_antd_lib_layout___default.a.Content,
    Footer = __WEBPACK_IMPORTED_MODULE_3_antd_lib_layout___default.a.Footer,
    Sider = __WEBPACK_IMPORTED_MODULE_3_antd_lib_layout___default.a.Sider;
var SubMenu = __WEBPACK_IMPORTED_MODULE_1_antd_lib_menu___default.a.SubMenu;

var Nav =
/*#__PURE__*/
function (_Component) {
  _inherits(Nav, _Component);

  function Nav() {
    var _ref;

    var _temp, _this;

    _classCallCheck(this, Nav);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_ref = Nav.__proto__ || Object.getPrototypeOf(Nav)).call.apply(_ref, [this].concat(args))), Object.defineProperty(_assertThisInitialized(_this), "state", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {
        collapsed: false
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "onCollapse", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(collapsed) {
        console.log(collapsed);

        _this.setState({
          collapsed: collapsed
        });
      }
    }), _temp));
  }

  _createClass(Nav, [{
    key: "render",
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_layout___default.a, {
        style: {
          minHeight: '100vh'
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 20
        }
      }, __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__top_TopNav__["a" /* default */], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 21
        }
      }), __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__side_SideNav__["a" /* default */], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 22
        }
      }, this.props.children));
    }
  }]);

  return Nav;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = (Nav);

/***/ }),

/***/ "./components/ui/nav/side/SideNav.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_antd_lib_icon_style_css__ = __webpack_require__("antd/lib/icon/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_antd_lib_icon_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_antd_lib_icon_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_antd_lib_icon__ = __webpack_require__("antd/lib/icon");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_antd_lib_icon___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_antd_lib_icon__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_antd_lib_menu_style_css__ = __webpack_require__("antd/lib/menu/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_antd_lib_menu_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_antd_lib_menu_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_antd_lib_menu__ = __webpack_require__("antd/lib/menu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_antd_lib_layout_style_css__ = __webpack_require__("antd/lib/layout/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_antd_lib_layout_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_antd_lib_layout_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_antd_lib_layout__ = __webpack_require__("antd/lib/layout");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_antd_lib_layout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_antd_lib_layout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react__);






var _jsxFileName = "/Users/fabioespinosa/Desktop/runregistry/components/ui/nav/side/SideNav.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }


var Sider = __WEBPACK_IMPORTED_MODULE_5_antd_lib_layout___default.a.Sider;
var SubMenu = __WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.SubMenu;

var SideNav =
/*#__PURE__*/
function (_Component) {
  _inherits(SideNav, _Component);

  function SideNav() {
    _classCallCheck(this, SideNav);

    return _possibleConstructorReturn(this, (SideNav.__proto__ || Object.getPrototypeOf(SideNav)).apply(this, arguments));
  }

  _createClass(SideNav, [{
    key: "render",
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5_antd_lib_layout___default.a, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 9
        }
      }, __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(Sider, {
        collapsible: true,
        width: 200,
        style: {
          background: '#fff'
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 10
        }
      }, __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a, {
        mode: "inline",
        defaultSelectedKeys: ['1'],
        defaultOpenKeys: ['sub1'],
        style: {
          height: '100%',
          borderRight: 0
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 11
        }
      }, __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(SubMenu, {
        key: "sub1",
        title: __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement("span", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 20
          }
        }, __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_antd_lib_icon___default.a, {
          type: "rocket",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 21
          }
        }), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement("span", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 22
          }
        }, "RUNS")),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 17
        }
      }, __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "1",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 26
        }
      }, "ALL"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "2",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 27
        }
      }, "CURRENT"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "3",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 28
        }
      }, "SELECTED")), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 30
        }
      }, __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 31
        }
      }, __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_antd_lib_icon___default.a, {
        type: "bulb",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 32
        }
      }), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 33
        }
      }, "LUMISECTIONS"))), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(SubMenu, {
        key: "sub3",
        title: __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement("span", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 39
          }
        }, __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_antd_lib_icon___default.a, {
          type: "laptop",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 40
          }
        }), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement("span", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 41
          }
        }, "WORKSPACE")),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 36
        }
      }, __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "4",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 45
        }
      }, "GLOBAL"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "5",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 46
        }
      }, "BTAG"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "6",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 47
        }
      }, "CASTOR"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "7",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 48
        }
      }, "CSC"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "8",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 49
        }
      }, "CTPPS"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "9",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 50
        }
      }, "DT"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "10",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 51
        }
      }, "ECAL"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "11",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 52
        }
      }, "EGAMMA"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "12",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 53
        }
      }, "HCAL"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "13",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 54
        }
      }, "HLT"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "14",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 55
        }
      }, "JETMET"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "15",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 56
        }
      }, "L1T"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "16",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 57
        }
      }, "LUMI"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "17",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 58
        }
      }, "LUMI"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "18",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 59
        }
      }, "MUON"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "19",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 60
        }
      }, "RPC"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "20",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 61
        }
      }, "TAU"), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd_lib_menu___default.a.Item, {
        key: "21",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 62
        }
      }, "TRACKER")))), __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5_antd_lib_layout___default.a, {
        style: {
          padding: '0 24px 24px'
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 66
        }
      }, this.props.children));
    }
  }]);

  return SideNav;
}(__WEBPACK_IMPORTED_MODULE_6_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = (SideNav);

/***/ }),

/***/ "./components/ui/nav/top/TopNav.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_antd_lib_menu_style_css__ = __webpack_require__("antd/lib/menu/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_antd_lib_menu_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_antd_lib_menu_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_antd_lib_menu__ = __webpack_require__("antd/lib/menu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_antd_lib_menu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_antd_lib_menu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_antd_lib_layout_style_css__ = __webpack_require__("antd/lib/layout/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_antd_lib_layout_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_antd_lib_layout_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_antd_lib_layout__ = __webpack_require__("antd/lib/layout");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_antd_lib_layout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_antd_lib_layout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_styled_jsx_style__ = __webpack_require__("styled-jsx/style");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_styled_jsx_style___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_styled_jsx_style__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);




var _jsxFileName = "/Users/fabioespinosa/Desktop/runregistry/components/ui/nav/top/TopNav.js";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }


var Header = __WEBPACK_IMPORTED_MODULE_3_antd_lib_layout___default.a.Header,
    Content = __WEBPACK_IMPORTED_MODULE_3_antd_lib_layout___default.a.Content,
    Footer = __WEBPACK_IMPORTED_MODULE_3_antd_lib_layout___default.a.Footer,
    Sider = __WEBPACK_IMPORTED_MODULE_3_antd_lib_layout___default.a.Sider;

var TopNav =
/*#__PURE__*/
function (_Component) {
  _inherits(TopNav, _Component);

  function TopNav() {
    _classCallCheck(this, TopNav);

    return _possibleConstructorReturn(this, (TopNav.__proto__ || Object.getPrototypeOf(TopNav)).apply(this, arguments));
  }

  _createClass(TopNav, [{
    key: "render",
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(Header, {
        className: "header",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 8
        }
      }, __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_antd_lib_menu___default.a, {
        theme: "dark",
        mode: "horizontal",
        defaultSelectedKeys: ['2'],
        style: {
          lineHeight: '64px'
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 9
        }
      }, __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_antd_lib_menu___default.a.Item, {
        key: "0",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 15
        }
      }, __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 16
        },
        className: "jsx-148027940"
      }, __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement("img", {
        src: "./static/images/cms_logo.png",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 17
        },
        className: "jsx-148027940" + " " + "logo"
      }))), __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_antd_lib_menu___default.a.Item, {
        key: "1",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 23
        }
      }, "ONLINE"), __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_antd_lib_menu___default.a.Item, {
        key: "2",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 24
        }
      }, "OFFLINE"), __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_antd_lib_menu___default.a.Item, {
        key: "3",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 25
        }
      }, "USER")), __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4_styled_jsx_style___default.a, {
        styleId: "683262603",
        css: ".logo.jsx-148027940{width:50px;}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdWkvbmF2L3RvcC9Ub3BOYXYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBMEI0QixBQUdvQyxXQUNmIiwiZmlsZSI6ImNvbXBvbmVudHMvdWkvbmF2L3RvcC9Ub3BOYXYuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2ZhYmlvZXNwaW5vc2EvRGVza3RvcC9ydW5yZWdpc3RyeSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBMYXlvdXQsIE1lbnUsIEJyZWFkY3J1bWIsIEljb24gfSBmcm9tICdhbnRkJztcbmNvbnN0IHsgSGVhZGVyLCBDb250ZW50LCBGb290ZXIsIFNpZGVyIH0gPSBMYXlvdXQ7XG5cbmNsYXNzIFRvcE5hdiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEhlYWRlciBjbGFzc05hbWU9XCJoZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8TWVudVxuICAgICAgICAgICAgICAgICAgICB0aGVtZT1cImRhcmtcIlxuICAgICAgICAgICAgICAgICAgICBtb2RlPVwiaG9yaXpvbnRhbFwiXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRTZWxlY3RlZEtleXM9e1snMiddfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBsaW5lSGVpZ2h0OiAnNjRweCcgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxNZW51Lkl0ZW0ga2V5PVwiMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJsb2dvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPVwiLi9zdGF0aWMvaW1hZ2VzL2Ntc19sb2dvLnBuZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9NZW51Lkl0ZW0+XG4gICAgICAgICAgICAgICAgICAgIDxNZW51Lkl0ZW0ga2V5PVwiMVwiPk9OTElORTwvTWVudS5JdGVtPlxuICAgICAgICAgICAgICAgICAgICA8TWVudS5JdGVtIGtleT1cIjJcIj5PRkZMSU5FPC9NZW51Lkl0ZW0+XG4gICAgICAgICAgICAgICAgICAgIDxNZW51Lkl0ZW0ga2V5PVwiM1wiPlVTRVI8L01lbnUuSXRlbT5cbiAgICAgICAgICAgICAgICA8L01lbnU+XG4gICAgICAgICAgICAgICAgPHN0eWxlIGpzeD57YFxuICAgICAgICAgICAgICAgICAgICAubG9nbyB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNTBweDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGB9PC9zdHlsZT5cbiAgICAgICAgICAgICAgICA8c3R5bGUganN4IGdsb2JhbD57YFxuICAgICAgICAgICAgICAgICAgICAuY3VzdG9tLWZpbHRlci1kcm9wZG93biB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiA4cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCAxcHggNnB4IHJnYmEoMCwgMCwgMCwgMC4yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC5jdXN0b20tZmlsdGVyLWRyb3Bkb3duIGlucHV0IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMzBweDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogOHB4O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLmhpZ2hsaWdodCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogI2Y1MDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGB9PC9zdHlsZT5cbiAgICAgICAgICAgIDwvSGVhZGVyPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVG9wTmF2O1xuIl19 */\n/*@ sourceURL=components/ui/nav/top/TopNav.js */"
      }), __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4_styled_jsx_style___default.a, {
        styleId: "797305798",
        css: ".custom-filter-dropdown{padding:8px;border-radius:6px;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,0.2);}.custom-filter-dropdown input{width:130px;margin-right:8px;}.highlight{color:#f50;}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdWkvbmF2L3RvcC9Ub3BOYXYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBK0JtQyxBQUdxQyxBQU9BLEFBS0QsV0FDZixDQVpzQixBQU9ELGlCQUNyQixDQVBvQixnQkFDd0IscUNBQzVDIiwiZmlsZSI6ImNvbXBvbmVudHMvdWkvbmF2L3RvcC9Ub3BOYXYuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2ZhYmlvZXNwaW5vc2EvRGVza3RvcC9ydW5yZWdpc3RyeSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBMYXlvdXQsIE1lbnUsIEJyZWFkY3J1bWIsIEljb24gfSBmcm9tICdhbnRkJztcbmNvbnN0IHsgSGVhZGVyLCBDb250ZW50LCBGb290ZXIsIFNpZGVyIH0gPSBMYXlvdXQ7XG5cbmNsYXNzIFRvcE5hdiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEhlYWRlciBjbGFzc05hbWU9XCJoZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8TWVudVxuICAgICAgICAgICAgICAgICAgICB0aGVtZT1cImRhcmtcIlxuICAgICAgICAgICAgICAgICAgICBtb2RlPVwiaG9yaXpvbnRhbFwiXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRTZWxlY3RlZEtleXM9e1snMiddfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBsaW5lSGVpZ2h0OiAnNjRweCcgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxNZW51Lkl0ZW0ga2V5PVwiMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJsb2dvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPVwiLi9zdGF0aWMvaW1hZ2VzL2Ntc19sb2dvLnBuZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9NZW51Lkl0ZW0+XG4gICAgICAgICAgICAgICAgICAgIDxNZW51Lkl0ZW0ga2V5PVwiMVwiPk9OTElORTwvTWVudS5JdGVtPlxuICAgICAgICAgICAgICAgICAgICA8TWVudS5JdGVtIGtleT1cIjJcIj5PRkZMSU5FPC9NZW51Lkl0ZW0+XG4gICAgICAgICAgICAgICAgICAgIDxNZW51Lkl0ZW0ga2V5PVwiM1wiPlVTRVI8L01lbnUuSXRlbT5cbiAgICAgICAgICAgICAgICA8L01lbnU+XG4gICAgICAgICAgICAgICAgPHN0eWxlIGpzeD57YFxuICAgICAgICAgICAgICAgICAgICAubG9nbyB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNTBweDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGB9PC9zdHlsZT5cbiAgICAgICAgICAgICAgICA8c3R5bGUganN4IGdsb2JhbD57YFxuICAgICAgICAgICAgICAgICAgICAuY3VzdG9tLWZpbHRlci1kcm9wZG93biB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiA4cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCAxcHggNnB4IHJnYmEoMCwgMCwgMCwgMC4yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC5jdXN0b20tZmlsdGVyLWRyb3Bkb3duIGlucHV0IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMzBweDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogOHB4O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLmhpZ2hsaWdodCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogI2Y1MDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGB9PC9zdHlsZT5cbiAgICAgICAgICAgIDwvSGVhZGVyPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVG9wTmF2O1xuIl19 */\n/*@ sourceURL=components/ui/nav/top/TopNav.js */"
      }));
    }
  }]);

  return TopNav;
}(__WEBPACK_IMPORTED_MODULE_5_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = (TopNav);

/***/ }),

/***/ "./components/ui/theme.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export colors */
/* unused harmony export typography */
/* unused harmony export tablet */
/* unused harmony export phone */


var colors = {
  white: '#FFFFFF',
  primary: '#3464d9',
  primaryHover: '#545FCE',
  primaryDisabled: '#B3B8F2',
  secondary: '#6E8097',
  success: '#24B47E',
  successHover: '#1BA26F',
  successDisabled: '#91D9BE',
  danger: '#D8315B',
  dangerHover: '#C72951',
  dangerDisabled: '#E394A7',
  default: '#CCCCCC',
  defaultHover: '#777777',
  inputBorder: '#E4E6F0',
  border: 'rgba(228, 230, 240, .5)',
  heading: '#292E31',
  grayDark: '#333333',
  grayLight: '#CCCCCC',
  gray: '#999999',
  blueLight: '#FBFBFD',
  facebook: '#3B5998',
  twitter: '#00ACED'
};
var typography = {
  f10: '.6rem',
  f12: '.75rem',
  f14: '.85rem',
  f16: '1rem',
  f18: '1.15rem',
  f20: '1.25rem',
  f24: '1.5rem',
  f26: '1.75rem',
  f30: '2rem',
  f56: '3.5rem'
};
var tablet = "screen and (max-width: 768px)";
var phone = "screen and (max-width: 414px)";

/***/ }),

/***/ "./layout/page.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_next_head__ = __webpack_require__("next/head");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_next_head___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_next_head__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_next_router__ = __webpack_require__("next/router");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_next_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_next_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_nprogress__ = __webpack_require__("nprogress");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_nprogress___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_nprogress__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_antd_dist_antd_min_css__ = __webpack_require__("./node_modules/antd/dist/antd.min.css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_antd_dist_antd_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_antd_dist_antd_min_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_analytics__ = __webpack_require__("./services/analytics.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_ui_nav_Nav__ = __webpack_require__("./components/ui/nav/Nav.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_ui_theme__ = __webpack_require__("./components/ui/theme.js");
var _jsxFileName = "/Users/fabioespinosa/Desktop/runregistry/layout/page.js";








/**
 * Starts nprogress (the 5px colored bar on top that appears progressing as route changes)
 * @param {*} url
 */

__WEBPACK_IMPORTED_MODULE_2_next_router___default.a.onRouteChangeStart = function (url) {
  return __WEBPACK_IMPORTED_MODULE_3_nprogress___default.a.start();
};

__WEBPACK_IMPORTED_MODULE_2_next_router___default.a.onRouteChangeComplete = function () {
  return __WEBPACK_IMPORTED_MODULE_3_nprogress___default.a.done();
};

__WEBPACK_IMPORTED_MODULE_2_next_router___default.a.onRouteChangeError = function () {
  return __WEBPACK_IMPORTED_MODULE_3_nprogress___default.a.done();
};
/**
 * This functional component is used for
 * @param {} props
 */


var Page = function Page(props) {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_next_head___default.a, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("link", {
    rel: "stylesheet",
    type: "text/css",
    href: "/static/nprogress.css",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    }
  }), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("meta", {
    charSet: "utf-8",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    }
  }), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("meta", {
    name: "viewport",
    content: "width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    }
  }), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("link", {
    rel: "stylesheet",
    href: "/_next/static/style.css",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    }
  })), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__components_ui_nav_Nav__["a" /* default */], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    }
  }, props.children));
};

/* harmony default export */ __webpack_exports__["a"] = (Page);

/***/ }),

/***/ "./node_modules/antd/dist/antd.min.css":
/***/ (function(module, exports) {



/***/ }),

/***/ "./pages/home.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_antd_lib_layout_style_css__ = __webpack_require__("antd/lib/layout/style/css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_antd_lib_layout_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_antd_lib_layout_style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_antd_lib_layout__ = __webpack_require__("antd/lib/layout");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_antd_lib_layout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_antd_lib_layout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_next_link__ = __webpack_require__("next/link");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_next_link___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_next_link__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__layout_page__ = __webpack_require__("./layout/page.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_ui_breadcrumb_Breadcrumb__ = __webpack_require__("./components/ui/breadcrumb/Breadcrumb.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_home_run_table_RunTable__ = __webpack_require__("./components/home/run_table/RunTable.js");


var _jsxFileName = "/Users/fabioespinosa/Desktop/runregistry/pages/home.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var Content = __WEBPACK_IMPORTED_MODULE_1_antd_lib_layout___default.a.Content;

var Home =
/*#__PURE__*/
function (_Component) {
  _inherits(Home, _Component);

  function Home() {
    _classCallCheck(this, Home);

    return _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).apply(this, arguments));
  }

  _createClass(Home, [{
    key: "render",
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__layout_page__["a" /* default */], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 18
        }
      }, __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__components_ui_breadcrumb_Breadcrumb__["a" /* default */], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 19
        }
      }), __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(Content, {
        style: {
          background: '#fff',
          padding: 20,
          margin: 0,
          minHeight: 280
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 20
        }
      }, __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__components_home_run_table_RunTable__["a" /* default */], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 28
        }
      })));
    }
  }], [{
    key: "getInitialProps",
    value: function getInitialProps(_ref) {
      var store = _ref.store,
          isServer = _ref.isServer;
      // Init auth
      return {};
    }
  }]);

  return Home;
}(__WEBPACK_IMPORTED_MODULE_2_react__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Home);

/***/ }),

/***/ "./services/analytics.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export initGA */
/* unused harmony export logPageView */
/* unused harmony export logEvent */
/* unused harmony export logException */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_ga__ = __webpack_require__("react-ga");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_ga___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react_ga__);

var initGA = function initGA() {
  __WEBPACK_IMPORTED_MODULE_0_react_ga___default.a.initialize('UA-0000000-1');
};
var logPageView = function logPageView() {
  __WEBPACK_IMPORTED_MODULE_0_react_ga___default.a.set({
    page: window.location.pathname
  });
  __WEBPACK_IMPORTED_MODULE_0_react_ga___default.a.pageview(window.location.pathname);
};
var logEvent = function logEvent() {
  var category = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (category && action) {
    __WEBPACK_IMPORTED_MODULE_0_react_ga___default.a.event({
      category: category,
      action: action
    });
  }
};
var logException = function logException() {
  var description = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var fatal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (description) {
    __WEBPACK_IMPORTED_MODULE_0_react_ga___default.a.exception({
      description: description,
      fatal: fatal
    });
  }
};

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./pages/home.js");


/***/ }),

/***/ "antd/lib/breadcrumb":
/***/ (function(module, exports) {

module.exports = require("antd/lib/breadcrumb");

/***/ }),

/***/ "antd/lib/breadcrumb/style/css":
/***/ (function(module, exports) {

module.exports = require("antd/lib/breadcrumb/style/css");

/***/ }),

/***/ "antd/lib/button":
/***/ (function(module, exports) {

module.exports = require("antd/lib/button");

/***/ }),

/***/ "antd/lib/button/style/css":
/***/ (function(module, exports) {

module.exports = require("antd/lib/button/style/css");

/***/ }),

/***/ "antd/lib/form":
/***/ (function(module, exports) {

module.exports = require("antd/lib/form");

/***/ }),

/***/ "antd/lib/form/style/css":
/***/ (function(module, exports) {

module.exports = require("antd/lib/form/style/css");

/***/ }),

/***/ "antd/lib/icon":
/***/ (function(module, exports) {

module.exports = require("antd/lib/icon");

/***/ }),

/***/ "antd/lib/icon/style/css":
/***/ (function(module, exports) {

module.exports = require("antd/lib/icon/style/css");

/***/ }),

/***/ "antd/lib/input":
/***/ (function(module, exports) {

module.exports = require("antd/lib/input");

/***/ }),

/***/ "antd/lib/input-number":
/***/ (function(module, exports) {

module.exports = require("antd/lib/input-number");

/***/ }),

/***/ "antd/lib/input-number/style/css":
/***/ (function(module, exports) {

module.exports = require("antd/lib/input-number/style/css");

/***/ }),

/***/ "antd/lib/input/style/css":
/***/ (function(module, exports) {

module.exports = require("antd/lib/input/style/css");

/***/ }),

/***/ "antd/lib/layout":
/***/ (function(module, exports) {

module.exports = require("antd/lib/layout");

/***/ }),

/***/ "antd/lib/layout/style/css":
/***/ (function(module, exports) {

module.exports = require("antd/lib/layout/style/css");

/***/ }),

/***/ "antd/lib/menu":
/***/ (function(module, exports) {

module.exports = require("antd/lib/menu");

/***/ }),

/***/ "antd/lib/menu/style/css":
/***/ (function(module, exports) {

module.exports = require("antd/lib/menu/style/css");

/***/ }),

/***/ "antd/lib/popconfirm":
/***/ (function(module, exports) {

module.exports = require("antd/lib/popconfirm");

/***/ }),

/***/ "antd/lib/popconfirm/style/css":
/***/ (function(module, exports) {

module.exports = require("antd/lib/popconfirm/style/css");

/***/ }),

/***/ "antd/lib/table":
/***/ (function(module, exports) {

module.exports = require("antd/lib/table");

/***/ }),

/***/ "antd/lib/table/style/css":
/***/ (function(module, exports) {

module.exports = require("antd/lib/table/style/css");

/***/ }),

/***/ "next/head":
/***/ (function(module, exports) {

module.exports = require("next/head");

/***/ }),

/***/ "next/link":
/***/ (function(module, exports) {

module.exports = require("next/link");

/***/ }),

/***/ "next/router":
/***/ (function(module, exports) {

module.exports = require("next/router");

/***/ }),

/***/ "nprogress":
/***/ (function(module, exports) {

module.exports = require("nprogress");

/***/ }),

/***/ "react":
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-ga":
/***/ (function(module, exports) {

module.exports = require("react-ga");

/***/ }),

/***/ "styled-jsx/style":
/***/ (function(module, exports) {

module.exports = require("styled-jsx/style");

/***/ })

/******/ });
//# sourceMappingURL=home.js.map