import React, { Component } from 'react';
import { Formik, Field } from 'formik';

class EditRun extends Component {
    render() {
        const {
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
        } = this.props;
        return (
            <div>
                <Formik
                    onSubmit={evt => {
                        console.log(evt);
                    }}
                    render={props => (
                        <form onSubmit={props.handleSubmit}>
                            <Field component="select" name="component">
                                <option value="hello">good</option>
                                <option value="green">bad</option>
                                <option value="green">standby</option>
                            </Field>
                            <button type="submit">Submit</button>
                        </form>
                    )}
                />
            </div>
        );
    }
}

export default EditRun;
