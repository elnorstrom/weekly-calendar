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
      data: {},
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
        this.setState(() => ({ data: result }))
      })
      .then(() => this.updateWeek())
  };

  updateWeek(e) {
    let whichButton;
    let addOrSubtract = 0;
    let startOfWeek;
    let endOfWeek;
   
    if (e) {
      whichButton = e.target.value;
      addOrSubtract = whichButton === 'previous-week' ? -7 : +7;
      startOfWeek = moment().startOf('isoWeek').add(this.state.weekCounter + addOrSubtract, 'd');
      endOfWeek = moment().endOf('isoWeek').add(this.state.weekCounter + addOrSubtract, 'd');
    } else {
        startOfWeek = moment().startOf('isoWeek');
        endOfWeek = moment().endOf('isoWeek');
      }
      
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
    let eventsByDate = {}

    this.state.data.forEach((obj) => {
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
        <button value="previous-week" onClick={this.updateWeek}>Previous Week</button>
        <button value="next-week" onClick={this.updateWeek}>Next Week</button>
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
