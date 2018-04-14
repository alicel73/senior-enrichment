import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { createStudent } from './store';

class Students extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: 'Insert First Name',
            lastName: 'Insert Last Name',
            email: 'Insert Email',
            gpa: 'Insert GPA',
            campusName: 'Insert Campus Name',
            errors: {}
        }
        this.validators = {
            firstName: (value) => {
                if (!value) {
                    return '  Sorry, first name is required'
                }
            },
            lastName: (value) => {
                if (!value) {
                    return '  Sorry, last name is required'
                }
            },
            email: (value) => {
                if (!value) {
                    return '  Sorry, name is required'
                }
                if (value.indexOf('@') === -1) {
                    return '  Sorry, email is not in correct format'
                }
            },
            gpa: (value) => {
                if ((value > 4) || (value <0)) {
                    return '  Sorry, gpa has to be between 0.0 and 4.0'
                }
            },
            campusName: (value) => {
                if (this.props.campusNamesOnly.indexOf(value) === -1) {
                    return '  Sorry, valid campus name is required'
                }
            }  
        }
        this.onChangeStudent = this.onChangeStudent.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    onChangeStudent(ev) {
        this.setState({ [ev.target.name]: ev.target.value });
        
    }

    onSave(ev) {
        ev.preventDefault();
        const campus = this.props.campuses.find(campus => campus.name === this.state.campusName);
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
        const student = { 
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email, 
            gpa: this.state.gpa,
            campusId: campus.id 
        };
        this.props.createStudent(student);
    }
    
    render() {
        const { campuses, students } = this.props;
        const { onSave, onChangeStudent } = this;
        const { firstName, lastName, email, gpa, campusName, errors } = this.state;
        if (!campuses) {
            return null;
        }

        if (students.length > 0) {       
            return(
                <div>        
                    <div className="container">               
                        <div className="row">
                            {                           
                                students.map(student => {
                                    const correctCampus = campuses.find(campus => student.campusId === campus.id);
                                    return (
                                        <div className="col-sm" key = { student.id }>
                                            <img src= '/images/student.jpeg' />
                                            <h4><Link to = {`/students/${student.id}`}>{ student.fullName }</Link></h4>
                                            <h4><Link to = {`/campuses/${student.campusId}`}>Campus: { correctCampus.name}</Link></h4>                                               
                                        </div>  
                                    )
                                })
                            }
                            <br />
                            <h4>Create A Student</h4>
                            <form onSubmit={ onSave }>
                                <label> First Name</label>
                                <input type='text' name = 'firstName' value = { firstName } onChange={ onChangeStudent } />
                                {
                                    errors.firstName
                                }
                                <br/>
                                <label>Last Name</label>
                                <input type='text' name = 'lastName' value = { lastName} onChange={ onChangeStudent }/>
                                {
                                    errors.lastName
                                }
                                <br/>
                                <label>Email</label>
                                <input type='text' name = 'email' value = { email } onChange={ onChangeStudent }/>
                                {
                                    errors.email
                                }
                                <br />
                                <label>GPA</label>
                                <input type='text' name = 'gpa' value = { gpa } onChange={ onChangeStudent }/>
                                {
                                    errors.gpa
                                }
                                <br/>
                                <label>Campus Name</label>
                                <input type='text' name = 'campusName' value = { campusName } onChange={ onChangeStudent }/>
                                {
                                    errors.campusName
                                }
                                <br/>                                
                                <button className="btn btn-primary">Create</button>
                            </form>

                        </div>
                    </div>

                </div>
            )
        }
        return ('Sorry, there are no students.')

    }
}

const mapStateToProps = ({ campuses, students }) => {
    const campusNamesOnly = campuses.map(campus => campus.name)
    return {
        campuses,
        students,
        campusNamesOnly
    };
};

const mapDispatchToProps = (dispatch, { history }) => {
    return {
        createStudent: (student) => {dispatch(createStudent(student, history))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Students);