import React from 'react';
// Material-UI
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

export default function Checkboxes(props) {
    return (
        <FormControl error={props.error}>
            <FormGroup row>
                {
                    props.checkboxes.map((item, index) => {
                        return (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        name={item.name}
                                        value={item.value}
                                        checked={item.value}
                                        onChange={props.onChange}
                                        color={item.color}
                                    />
                                }
                                label={item.label}
                            />
                        );
                    })
                }
            </FormGroup>
            {
                props.helperText &&
                <FormHelperText>{props.helperText}</FormHelperText>
            }
        </FormControl>
    );
};