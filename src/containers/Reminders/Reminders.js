import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Typography } from 'antd';
import moment from 'moment';

import ReminderList from '../../components/Reminders/ReminderList/ReminderList';
import ReminderModal from '../../components/Reminders/ReminderModal/ReminderModal';
import * as actions from '../../store/actions';
import { validaNewReminderDate } from '../../utils/dates';

const { Title } = Typography;

class Reminders extends Component {
  state = {
    date: '',
    dateReminders: [],
    visible: false,
    confirmLoading: false,
    selectedElement: {}
  };

  componentDidMount() {
    const { currentDate } = this.props;

    if (!currentDate) {
      this.props.history.push('/');
    }

    this.getDateReminders(currentDate);
    this.setState({ currentDate: this.props.currentDate });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reminders.length !== this.props.reminders.length) {
      this.getDateReminders(this.props.currentDate);
    }
  }

  showReminderModal = element => {
    this.setState({ visible: true, selectedElement: element });
  };

  handleOk = () => {
    this.setState({
      confirmLoading: true
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false
      });
    }, 2000);
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  getDateReminders = date => {
    const dateReminders = this.props.reminders.filter(reminder =>
      moment(reminder.date).isSame(date, 'day')
    );

    this.setState({ dateReminders });
  };

  editReminder = values => {
    this.props.onEditReminder(values);

    this.setState({ selectedElement: {} }, () => {
      this.getDateReminders(this.props.currentDate);
    });
  };

  deleteReminder = id => {
    this.props.onDeleteReminder(id);

    this.setState({ selectedElement: {} });
  };

  deleteAllItems = date => {
    const selectedDay = moment(date).format('MM/DD/YYYY');

    this.props.onDeleteAllReminders(selectedDay);

    this.setState({ dateReminders: [] });
  };

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <Fragment>
        <Title className="MainTitle">Your Reminders</Title>
        <Title level={2}>
          {moment(this.props.currentDate).format('MMMM D, YYYY')}
        </Title>

        <ReminderList
          reminders={this.state.dateReminders}
          editAction={this.showReminderModal}
          deleteAction={this.deleteReminder}
          deleteAllAction={this.deleteAllItems}
          selectedDay={this.props.currentDate}
          goBack={this.goBack}
        />

        {this.state.visible ? (
          <ReminderModal
            reminders={this.props.reminders}
            mode="edit"
            visible={this.state.visible}
            confirmLoading={this.state.confirmLoading}
            handleCancel={this.handleCancel}
            handleOk={this.handleOk}
            addItem={this.props.onAddReminder}
            editItem={this.editReminder}
            selectedDay={this.props.currentDate}
            getDateWeather={this.props.onSetWeather}
            getDateForecast={this.props.onSetForecast}
            defaultData={this.state.selectedElement}
            validateNewItem={validaNewReminderDate}
          />
        ) : null}
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentDate: state.rmd.currentDate,
    reminders: state.rmd.reminders
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddReminder: data => dispatch(actions.addReminder(data)),
    onAddCurrentDate: date => dispatch(actions.addCurrentDate(date)),
    onSetWeather: (city, reminderId) =>
      dispatch(actions.initGetWeather(city, reminderId)),
    onSetForecast: (city, date, reminderId) =>
      dispatch(actions.initGetForecast(city, date, reminderId)),
    onEditReminder: data => dispatch(actions.editReminder(data)),
    onDeleteReminder: id => dispatch(actions.deleteReminder(id)),
    onDeleteAllReminders: date => dispatch(actions.deleteAllDateReminders(date))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Reminders);
