import React from 'react';
// Packages
import { ValidatorComponent } from 'react-form-validator-core';
// Material-UI
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
// Styles
import Theme from '../../Theme';

export default class Dropdown extends ValidatorComponent {
    render() {
        const {
            name,
            disabled,
            value,
            list,
            error,
            errorMessages,
            validators,
            requiredError,
            helperText,
            validatorListener,
            withRequiredValidator,
            ...rest
        } = this.props;
        const { isValid } = this.state;
        return (
            <FormControl fullWidth variant="outlined" margin="dense" disabled={disabled}>
                <Select
                    native
                    {...rest}
                    value={value}
                    onChange={this.props.onChange}
                    input={<OutlinedInput name={name} />}
                    error={!isValid || error}
                >
                    <option value='' disabled></option>
                    {
                        list.map((item, index) => {
                            return (
                                <option key={index} value={item.value}>{item.label}</option>
                            );
                        })
                    }
                </Select>
                {
                    (helperText && isValid) &&
                    <FormHelperText>{helperText}</FormHelperText>
                }
                {
                    !isValid &&
                    <FormHelperText style={{ color: Theme.palette.secondary.main }}>{this.getErrorMessage()}</FormHelperText>
                }
            </FormControl>
        );
    }
}