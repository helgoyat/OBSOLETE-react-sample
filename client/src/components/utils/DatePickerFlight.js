import React, { Component } from 'react';
// Packages
import Moment from 'moment';
// Material-UI
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';

const MonthList = [
    { value: 0, name: 'January' },
    { value: 1, name: 'February' },
    { value: 2, name: 'March' },
    { value: 3, name: 'April' },
    { value: 4, name: 'May' },
    { value: 5, name: 'June' },
    { value: 6, name: 'July' },
    { value: 7, name: 'August' },
    { value: 8, name: 'September' },
    { value: 9, name: 'October' },
    { value: 10, name: 'November' },
    { value: 11, name: 'December' },
];

class DatePickerFlight extends Component {
    constructor() {
        super();
        this.state = {
            year: Moment().year(),
            month: Moment().month(),
            day: Moment().date()
        };
        this.handleYearChange = this.handleYearChange.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.generateFullDate = this.generateFullDate.bind(this);
    };

    componentDidMount() {
        const value = this.props.value;
        let date = Moment().add(1, 'day');
        if (value && this.verifyDate(value)) {
            date = value;
        };
        this.setState({
            year: Moment(date).year(),
            month: Moment(date).month(),
            day: Moment(date).date()
        });
    };

    handleYearChange(event) {
        const val = parseInt(event.target.value);
        const dayAfter = Moment().add(1, 'day');
        const month = (Moment(dayAfter).year() === val) ? Moment(dayAfter).month() : 0;
        const day = (Moment(dayAfter).year() === val) ? Moment(dayAfter).date() : 1;
        this.setState({
            year: val,
            month: month,
            day: day
        });
    };

    handleMonthChange(event) {
        const val = parseInt(event.target.value);
        const dayAfter = Moment().add(1, 'day');
        const day = ((Moment(dayAfter).year() === this.state.year) && (Moment(dayAfter).month() === val)) ? Moment(dayAfter).date() : 1;
        this.setState({
            month: val,
            day: day
        });
    };

    handleDayChange(event) {
        const val = parseInt(event.target.value);
        this.setState({
            day: val
        });
    };

    verifyDate(date) {
        const oneYearAhead = Moment().add(12, 'months');
        if ((Moment(date).isValid()) && (Moment(new Date()).diff(date) < 0) && (Moment(oneYearAhead).diff(date) > 0)) {
            return true;
        } else {
            return false;
        }
    };

    generateFullDate() {
        const fullDate = Moment().set({
            'year': this.state.year,
            'month': this.state.month,
            'date': this.state.day,
        }).format();
        // Check date validity
        const result = this.verifyDate(fullDate);
        if (result) {
            this.props.handleDateChange(fullDate);
        };
    };

    render() {
        // Current date + 1 day
        const dayAfter = Moment().add(1, 'day');
        const minYear = Moment(dayAfter).year();
        const minMonth = Moment(dayAfter).month();
        const minDate = Moment(dayAfter).date();
        // Year selector
        const yearsRange = [];
        const maximumYear = minYear + 1;
        for (let i = minYear; i <= maximumYear; i++) {
            yearsRange.push(<option key={i} value={i}>{i}</option>);
        };
        // Month selector
        let monthsRange = [];
        if (this.state.year === minYear) {
            monthsRange = MonthList.filter(e => e.value >= minMonth);
        } else {
            if (this.state.year === maximumYear) {
                monthsRange = MonthList.filter(e => e.value <= minMonth);
            } else {
                monthsRange = MonthList;
            };
        };
        // Day selector
        let daysRange = [];
        const format = this.state.year + "-" + (this.state.month + 1);
        const daysInMonth = Moment(format, "YYYY-MM").daysInMonth();
        if ((this.state.year === minYear) && (this.state.month === minMonth)) {
            for (let i = minDate; i <= daysInMonth; i++) {
                daysRange.push(<option key={i} value={i}>{i}</option>);
            };
        } else {
            if ((this.state.year === maximumYear) && (this.state.month === minMonth)) {
                for (let i = 1; i < minDate; i++) {
                    daysRange.push(<option key={i} value={i}>{i}</option>);
                };
            } else {
                for (let i = 1; i <= daysInMonth; i++) {
                    daysRange.push(<option key={i} value={i}>{i}</option>);
                };
            };
        };

        return (
            <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                <div style={{ flex: '30%', marginRight: '4px' }}>
                    <FormControl fullWidth variant="outlined" margin="dense" disabled={this.props.disabled}>
                        <Select
                            native
                            value={this.state.year}
                            onChange={this.handleYearChange}
                            onBlur={this.generateFullDate}
                            input={<OutlinedInput name="year" />}
                        >
                            {yearsRange}
                        </Select>
                        <FormHelperText>Year</FormHelperText>
                    </FormControl>
                </div>
                <div style={{ flex: '30%', marginRight: '4px' }}>
                    <FormControl fullWidth variant="outlined" margin="dense" disabled={this.props.disabled}>
                        <Select
                            native
                            value={this.state.month}
                            onChange={this.handleMonthChange}
                            onBlur={this.generateFullDate}
                            input={<OutlinedInput name="month" />}
                        >
                            {
                                monthsRange.map((item, index) => {
                                    return (
                                        <option key={index} value={item.value}>{item.name}</option>
                                    );
                                })
                            }
                        </Select>
                        <FormHelperText>Month</FormHelperText>
                    </FormControl>
                </div>
                <div style={{ flex: '30%' }}>
                    <FormControl fullWidth variant="outlined" margin="dense" disabled={this.props.disabled}>
                        <Select
                            native
                            value={this.state.day}
                            onChange={this.handleDayChange}
                            onBlur={this.generateFullDate}
                            input={<OutlinedInput name="day" />}
                        >
                            {daysRange}
                        </Select>
                        <FormHelperText>Day</FormHelperText>
                    </FormControl>
                </div>
            </div>
        );
    }
}

export default DatePickerFlight;