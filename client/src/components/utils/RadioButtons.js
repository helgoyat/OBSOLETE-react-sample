import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(3),
    },
    group: {
        margin: theme.spacing(1, 0),
    },
}));

export default function RadioButtonsGroup(props) {
    const classes = useStyles();
    function handleChange(event) {
        props.handleRadioChange(event.target.value);
    };
    return (
        <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">{props.title}</FormLabel>
            <RadioGroup
                aria-label={props.name}
                name={props.name}
                className={classes.group}
                value={props.value}
                onChange={handleChange}
            >
                {
                    props.radio.map((e, i) => (
                        <FormControlLabel key={i} value={e.value} control={<Radio />} label={e.label} />
                    ))
                }
            </RadioGroup>
        </FormControl>
    );
}