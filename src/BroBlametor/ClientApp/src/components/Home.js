import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import Sevens from './Sevens';
import Stats from './Stats';
import AllTicks from './AllTicks';
import FileUpload from './FileUpload';
import StatisticsMenu from './StatisticsMenu';
import { DateTime } from "luxon";

export class Home extends Component {
  static displayName = Home.name;

  constructor() {
    super();

    this.state = {
      grades: null,
      data: null,
      ticks: null
    }

    this.onFileUploaded = this.onFileUploaded.bind(this);
  }

  onFileUploaded(data) {
    const state = {
      data: data,
      grades: data.grades,
      ticks: data.ticks.map(t => {
        const timestamp = DateTime.fromISO(t.timestamp);
        return {
          ...t,
          timestamp,
          year: timestamp.year
        }
      })
    };
    this.setState(state);
  }

  render () {
    const { grades, ticks } = this.state;

    return (
      <div>
        {/* <h1>Bro Blametor</h1> */}
        { !this.state.data && <FileUpload onUploaded={this.onFileUploaded} /> }
        { this.state.data &&
          <React.Fragment>
            <StatisticsMenu />
            <Switch>
              <Route path='/' exact render={() => <Stats grades={grades} ticks={ticks} /> } />
              <Route path='/ticks' render={() => <AllTicks ticks={ticks} />} />
              <Route path='/sevens' render={() => <Sevens ticks={ticks} />} />
            </Switch>
          </React.Fragment>
        }
      </div>
    );
  }
}
