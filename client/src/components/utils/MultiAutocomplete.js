import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;

    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput,
                },
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
    const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem.find(e => e.value === suggestion.value) !== undefined);

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.value}
            selected={isHighlighted}
            component="div"
            style={{
                color: isSelected && '#2196f3',
                fontWeight: isSelected && 700,
            }}
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
        padding: 8,
    },
    inputInput: {
        width: 'auto',
        flexGrow: 1,
        padding: '4px 0px',
        paddingLeft: 4,
    },
    divider: {
        height: theme.spacing(2),
    },
}));

export default function DownshiftMultiple(props) {
    const classes = useStyles();
    const { options, initial, max } = props;
    const [inputValue, setInputValue] = React.useState('');
    const [selectedItem, setSelectedItem] = React.useState([initial]);

    const handleInputChange = event => {
        setInputValue(event.target.value);
    };

    const handleChange = item => {
        let newSelectedItem = [...selectedItem];
        if (newSelectedItem.length < max) {
            const isItem = (selectedItem.find(e => e.value === item.value) !== undefined);
            if (!isItem) {
                newSelectedItem = [...newSelectedItem, item];
            }
            if (newSelectedItem.length > 0) {
                newSelectedItem = newSelectedItem.filter(e => e.fixed === undefined);
            }
            setSelectedItem(newSelectedItem);
        };
        setInputValue('');
        props.onChange(newSelectedItem, props.name);
    };

    const handleDelete = item => () => {
        let newSelectedItem = [...selectedItem];
        newSelectedItem = newSelectedItem.filter(e => e.value !== item.value);
        if (newSelectedItem.length === 0) {
            newSelectedItem = [initial];
        }
        setSelectedItem(newSelectedItem);
        props.onChange(newSelectedItem, props.name);
    };

    return (
        <Downshift
            id="downshift-multiple"
            inputValue={inputValue}
            onChange={handleChange}
            selectedItem={selectedItem}
            itemToString={item => (item ? item.label : '')}
        >
            {({
                getInputProps,
                getItemProps,
                isOpen,
                openMenu,
                inputValue: inputValue2,
                selectedItem: selectedItem2,
                highlightedIndex,
            }) => {
                const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
                    onFocus: openMenu,
                    placeholder: 'Search...',
                });

                return (
                    <div className={classes.container}>
                        {renderInput({
                            fullWidth: true,
                            classes,
                            InputProps: {
                                startAdornment: selectedItem.map(item => {
                                    if (item.fixed) {
                                        return (
                                            <Chip
                                                key={item.value}
                                                tabIndex={-1}
                                                label={item.label}
                                                className={classes.chip}
                                                style={{
                                                    backgroundColor: '#ffc107',
                                                    color: '#fff',
                                                }}
                                            />
                                        );
                                    } else {
                                        return (
                                            <Chip
                                                key={item.value}
                                                tabIndex={-1}
                                                label={item.label}
                                                className={classes.chip}
                                                onDelete={handleDelete(item)}
                                            />
                                        );
                                    }
                                }),
                                onBlur,
                                onChange: event => {
                                    handleInputChange(event);
                                    onChange(event);
                                },
                                onFocus,
                            },
                            inputProps,
                        })}

                        {isOpen ? (
                            <Paper className={classes.paper} square>
                                {getSuggestions(options, inputValue2, { showEmpty: true }).map((suggestion, index) =>
                                    renderSuggestion({
                                        suggestion,
                                        index,
                                        itemProps: getItemProps({ item: suggestion }),
                                        highlightedIndex,
                                        selectedItem: selectedItem2,
                                    }),
                                )}
                            </Paper>
                        ) : null}
                    </div>
                );
            }}
        </Downshift>
    );
}