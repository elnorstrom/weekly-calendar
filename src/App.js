import React, { Component } from 'react';
import './App.css';
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);
    this.updateWeek = this.updateWeek.bind(this);
    this.addEvents = this.addEvents.bind(this);
    this.setEventsByDay = this.setEventsByDay.bind(this);
    this.state = {
      calendarDataFromApi: {},
      currentWeek: [],
      isoDays: [],
      weekCounter: 0,
      eventsByDate: {},
      eventsForTheWeek: {},
      eventLabels: []
    }
  };

  componentDidMount() {
    fetch('https://cors-anywhere.herokuapp.com/http://assessments.bzzhr.net/calendar', {
      method: 'GET'
    }).then(response => response.json())
      .then((result) => {
        this.setState(() => ({ calendarDataFromApi: result }))
      })
      .then(() => this.updateWeek())
  };

  // Sets up the current week with the use of moment.js, 
  // it also shifts the week forwards or backwords 7 days depending on which
  // button was clicked
  updateWeek(numberOfDays) {

    let addOrSubtract = numberOfDays ? numberOfDays : 0;
    let startOfWeek = moment().startOf('isoWeek').add(this.state.weekCounter + addOrSubtract, 'd');
    let endOfWeek = moment().endOf('isoWeek').add(this.state.weekCounter + addOrSubtract, 'd');
      
    let day = startOfWeek;
    let week = [];
    let isoDays = [];
 
    while (day <= endOfWeek) {
      week.push(day._d.toString().substr(0, 10));
      day = day.clone().add(1, 'd')
      isoDays.push(day._d.toISOString().substr(0, 10));
    }

    this.setState((prevState) => (
      { 
        currentWeek: week,
        isoDays: isoDays,
        weekCounter: prevState.weekCounter + addOrSubtract
      }
    ))
    this.addEvents();
  };

  addEvents() {
    // Restructures the API data to an object called eventsByDate,
    // with the dates set as keys
    let eventsByDate = {}

    this.state.calendarDataFromApi.forEach((obj) => {
      let currentObjectKey = obj.start.substr(0, 10);
      if (!eventsByDate[currentObjectKey]) {
        eventsByDate[currentObjectKey] = [obj];
      } else {
          eventsByDate[currentObjectKey].push(obj);
        }
    });
  
    this.setState(() => ({
      eventsByDate: eventsByDate
    }));

    // Matches any events in the eventsByDate object to the
    // week that is currently displayed, storing them in the eventsForTheWeek array
    let eventsForTheWeek = [];

    this.state.isoDays.forEach((date => {
      let events = this.state.eventsByDate;
      if (events[date]) {
        eventsForTheWeek.push(events[date]);
      } else {
          eventsForTheWeek.push([]);
        }
    }));

    this.setState(() => ({
      eventsForTheWeek: eventsForTheWeek
    }))
    this.setEventsByDay();
  };

  // Picking out the labels and times from the eventsForTheWeek,
  // Storing them in the labels array with some light formatting
  setEventsByDay() {
    let labels = [];
    this.state.eventsForTheWeek.forEach((arr) => {
      let labelArrays = [];
      arr.forEach((obj) => {
        labelArrays.push(`${obj.label} - ${obj.start.substr(11).replace(/\Z/, '')} - ${obj.end.substr(11).replace(/\Z/, '')} `);
      })
      labels.push(labelArrays)
      this.setState(() => ({
        eventLabels: labels
      }))
    })
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Weekly Calendar</h1>
        </header>
        <button onClick={() => this.updateWeek(-7)}>Previous Week</button>
        <button onClick={() => this.updateWeek(7)}>Next Week</button>
        <div className="weekly-calendar--flex">
          <div>
            {this.state.currentWeek[0]}<br /><hr />
            {this.state.eventLabels[0]}
          </div>
          <div>
            {this.state.currentWeek[1]}<br /><hr />
            {this.state.eventLabels[1]}
          </div>
          <div>
            {this.state.currentWeek[2]}<br /><hr />
            {this.state.eventLabels[2]}
          </div>
          <div>
            {this.state.currentWeek[3]}<br /><hr />
            {this.state.eventLabels[3]}
          </div>
          <div>
            {this.state.currentWeek[4]}<br /><hr />
            {this.state.eventLabels[4]}
          </div>
          <div>
            {this.state.currentWeek[5]}<br /><hr />
            {this.state.eventLabels[5]}
          </div>
          <div>
            {this.state.currentWeek[6]}<br /><hr />
            {this.state.eventLabels[6]}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
