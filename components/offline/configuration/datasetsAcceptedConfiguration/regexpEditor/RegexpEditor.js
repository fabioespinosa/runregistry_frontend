import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import { Input, Button, Checkbox } from 'antd';
const { TextArea } = Input;

class RegexpEditor extends Component {
    render() {
        const { editing, cancel, submit } = this.props;
        return (
            <div className="editor">
                <Formik
                    initialValues={editing}
                    onSubmit={submit}
                    render={({
                        values,
                        setFieldValue,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => (
                        <form onSubmit={handleSubmit}>
                            Dataset name:
                            <TextArea
                                value={values['name']}
                                onChange={evt =>
                                    setFieldValue('name', evt.target.value)
                                }
                                name="name"
                                row={1}
                                type="text"
                                autosize
                            />
                            Dataset Regexp:
                            <TextArea
                                value={values['regexp']}
                                onChange={evt =>
                                    setFieldValue('regexp', evt.target.value)
                                }
                                name="regexp"
                                row={1}
                                type="text"
                                autosize
                            />
                            <br />
                            <br />
                            Runs from :
                            <Input
                                style={{ width: '100px' }}
                                value={values['run_from']}
                                name="run_from"
                                onChange={evt =>
                                    setFieldValue('run_from', evt.target.value)
                                }
                                type="text"
                            />
                            &nbsp; Runs to:{' '}
                            <Input
                                style={{ width: '100px' }}
                                value={values['run_to']}
                                name="run_to"
                                onChange={evt =>
                                    setFieldValue('run_to', evt.target.value)
                                }
                                type="text"
                            />
                            <br />
                            <br />
                            <Checkbox
                                name="enabled"
                                checked={values['enabled']}
                                onChange={evt =>
                                    setFieldValue('enabled', evt.target.checked)
                                }
                            >
                                Enabled
                            </Checkbox>
                            <div className="submit_button">
                                <Button onClick={cancel}>Cancel</Button>
                                <Button type="primary" htmlType="submit">
                                    {editing ? 'Edit' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    )}
                />
                <style jsx>{`
                    .editor {
                        margin: 0 auto;
                        width: 500px;
                    }
                    .submit_button {
                        display: flex;
                        justify-content: flex-end;
                    }
                `}</style>
            </div>
        );
    }
}

export default RegexpEditor;
