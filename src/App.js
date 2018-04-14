import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { 
    loadStudents, 
    loadCampuses
} from './store';

import Nav from './Nav'
import Campuses from './Campuses';
import Campus from './Campus';
import Home from './Home';
import Students from './Students';
import Student from './Student';

class App extends Component {
    componentDidMount() {
        this.props.getCampuses();
        this.props.getStudents();

    }
    render() {
        return (
            <Router>
                <div>
                    <Nav />
                    <Route path='/' exact component={ Home } />
                    <Switch>
                        <Route path='/students' exact render={({ history }) => 
                            <Students history={ history }/> } />
                        <Route path='/students/:id' exact render={({ match, history }) => 
                            <Student id={ match.params.id*1 } history={ history }/> } />
                        <Route path='/campuses' exact render={({ history }) => 
                            <Campuses history={ history }/> } />
                        <Route path='/campuses/:id' exact render={({ match, history }) => 
                            <Campus id={ match.params.id*1 } history={ history }/> } />
                    </Switch>    
                
                </div>
            </Router>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {   
        getCampuses: () => dispatch(loadCampuses()),
        getStudents: () => dispatch(loadStudents())
    }
}

export default connect(null, mapDispatchToProps)(App);





