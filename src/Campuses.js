import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { createCampus } from './store';

class Campuses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'Insert Name',
            imageURL: 'Insert Image URL',
            description: 'Insert Description',
            errors: {}
        }
        this.onChangeCampus = this.onChangeCampus.bind(this);
        this.onSave = this.onSave.bind(this);
        this.validators = {
            name: (value) => {
                if (!value) {
                    return '  Sorry, name is required';
                }
            }
        }
    }

    onChangeCampus(ev) {
        this.setState({ [ev.target.name]: ev.target.value });
        
    }

    onSave(ev) {
        ev.preventDefault();
        const errors = Object.keys(this.validators).reduce((errorObj, key) => {
            const validator = this.validators[key];
            const value = this.state[key];
            const error = validator(value);
            if (error) {
                errorObj[key] = error;
            }
            return errorObj;
        }, {});
        this.setState({ errors });
        if(Object.keys(errors).length){
            return;
        }
        const campus = { 
            name: this.state.name,
            description: this.state.description, 
        };
        this.props.createCampus(campus);
    }
    
    render() {
        const { campuses, studentCount, students } = this.props;
        const { onSave, onChangeCampus } = this;
        const { name, imageURL, description, errors } = this.state;


        if (campuses.length > 0) {       
            return(
                <div>        
                    <div className="container">               
                        <div className="row">
                            {                           
                                campuses.map(campus => {
                                    return (
                                        <div className="col-sm" key = { campus.id }>
                                            <h4><Link to = {`/campuses/${campus.id}`}>{ campus.name }</Link></h4>
                                            <img src={ campus.imageURL } />    
                                            <p>Number of Students: { studentCount[campus.id] } </p>
                                            
                                            
                                        </div>  
                                    )
                                })
                            }
                            <h4>Create A Campus</h4>
                            <form onSubmit={ onSave }>
                                <label> Name</label>
                                <input type='text' name = 'name' value = { name } onChange={ onChangeCampus } />
                                {
                                    errors.name
                                }
                                <br/>
                                <label>Image URL</label>
                                <input type='text' name = 'imageURL' value = { imageURL} onChange={ onChangeCampus  }/>
                                <br/>
                                <label>Description</label>
                                <input type='text' name = 'description' value = { description } onChange={ onChangeCampus  }/>
                                <br/>
                                <button className="btn btn-primary">Create</button>
                            </form>

                        </div>
                    </div>

                </div>
            )
        }
        return ('Sorry, there are no campuses.')

    }
}


const mapStateToProps = ({ campuses, students }) => {
    const studentCount = students.reduce((tally, student) => {
        const id = student.campusId;
        if (tally[id]) {
            tally[id]++;
        } else {
            tally[id] = 1;
        }
        return tally;
    }, {})
    return {
        campuses,
        studentCount,
        students
    };
};

const mapDispatchToProps = (dispatch, { history }) => {
    return {
        createCampus: (campus) => {dispatch(createCampus(campus, history))}
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Campuses);
