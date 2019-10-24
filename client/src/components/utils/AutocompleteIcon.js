import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

import InputAdornment from '@material-ui/core/InputAdornment';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

function renderInput(inputProps) {
    const { InputProps, classes, ref, value, ...other } = inputProps;

    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput,
                },
                endAdornment: <InputAdornment position="end">
                    <CheckCircleIcon style={{ color: (value !== '') ? '#FFC107' : '#dddddd' }} />
                </InputAdornment>,
                ...InputProps,
            }}
            {...other}
            variant="outlined"
            margin="dense"
            fullWidth
        />
    );
}

renderInput.propTypes = {
    /**
     * Override or extend the styles applied to the component.
     */
    classes: PropTypes.object.isRequired,
    InputProps: PropTypes.object,
};

function renderSuggestion(suggestionProps) {
    const { suggestion, index, itemProps, highlightedIndex } = suggestionProps;
    const isHighlighted = highlightedIndex === index;

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.value}
            selected={isHighlighted}
            component="div"
        >
            {suggestion.label}
        </MenuItem>
    );
}

renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.number]).isRequired,
    index: PropTypes.number.isRequired,
    itemProps: PropTypes.object.isRequired,
    selectedItem: PropTypes.string.isRequired,
    suggestion: PropTypes.shape({
        label: PropTypes.string.isRequired,
    }).isRequired,
};

function getSuggestions(suggestions, value, { showEmpty = false } = {}) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0 && !showEmpty
        ? []
        : suggestions.filter(suggestion => {
            const keep = count < 5 && suggestion.label.toLowerCase().includes(inputValue);
            if (keep) {
                count += 1;
            }
            return keep;
        });
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        height: 250,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: 2,
        left: 0,
        right: 0,
        borderRadius: 4,
        backgroundColor: '#6e6e6e',
        marginBottom: 40,
    },
    chip: {
        margin: theme.spacing(0.5, 0.25),
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
    inputInput: {
        width: 'auto',
        flexGrow: 1,
        padding: 10,
    },
    divider: {
        height: theme.spacing(2),
    },
}));

export default function IntegrationDownshift(props) {
    const classes = useStyles();
    return (
        <Downshift
            id="downshift-options"
            onChange={selection => {
                props.onChange(props.name, selection ? selection.value : '')
            }}
            itemToString={item => (item ? item.label : '')}
        >
            {({
                clearSelection,
                getInputProps,
                getItemProps,
                getMenuProps,
                highlightedIndex,
                inputValue,
                isOpen,
                openMenu,
            }) => {
                const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
                    onChange: event => {
                        if (event.target.value === '') {
                            clearSelection();
                        }
                    },
                    onFocus: openMenu,
                    placeholder: 'Search...',
                });

                return (
                    <div className={classes.container}>
                        {renderInput({
                            fullWidth: true,
                            classes,
                            InputProps: { onBlur, onChange, onFocus },
                            inputProps,
                            // validators: props.validators,
                            // errorMessages: props.errorMessages,
                            value: props.value,
                        })}

                        <div {...getMenuProps()}>
                            {isOpen ? (
                                <Paper className={classes.paper} square>
                                    {getSuggestions(props.options, inputValue, { showEmpty: true }).map((suggestion, index) =>
                                        renderSuggestion({
                                            suggestion,
                                            index,
                                            itemProps: getItemProps({ item: suggestion }),
                                            highlightedIndex,
                                        }),
                                    )}
                                </Paper>
                            ) : null}
                        </div>
                    </div>
                );
            }}
        </Downshift>
    );
}