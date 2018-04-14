import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { updateStudent, deleteStudent } from './store';

class Student extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: this.props.selectedStudent.firstName ? this.props.selectedStudent.firstName : '',
            lastName: this.props.selectedStudent.lastName ? this.props.selectedStudent.lastName : '',
            email: this.props.selectedStudent.email ? this.props.selectedStudent.email : '',
            gpa: this.props.selectedStudent.gpa ? this.props.selectedStudent.gpa : '',
            campusName: this.props.campusNames[this.props.selectedStudent.campusId] ? this.props.campusNames[this.props.selectedStudent.campusId] : '',
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
        this.onDelete = this.onDelete.bind(this);
    }

 /*   componentWillReceiveProps(nextProps) {
        this.setState({ name: nextProps.selectedStudent.name ? nextProps.selectedStudent.name : '' })
    }*/

    onDelete() {
        this.props.deleteStudent({ id: this.props.id });
    }

    onChangeStudent(ev) {
        const change = {};
        change[ev.target.name] = ev.target.value;
        this.setState(change);
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
            id: this.props.id,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            gpa: this.state.gpa,
            campusId: campus.id
        };
        this.props.updateStudent(student);
    }

    render() {
        const { selectedStudent, campusNames } = this.props;
        const { onDelete, onSave, onChangeStudent } = this;
        const { firstName, lastName, email, gpa, campusName, errors } = this.state;
        if (!selectedStudent) {
            return null;
        }
        return (
           <div>          
                <div className="container">               
                    <div className="row">
                        <h2>{ firstName } { lastName }</h2>
                        <img src= '/images/student.jpeg' />
                        <h3> <Link to = {`/campuses/${selectedStudent.campusId}`}> Campus: { campusNames[selectedStudent.campusId] } </Link> </h3>
                        <p>   </p>
                        <button className="btn btn-primary" onClick={ onDelete }>Delete Student</button>
                            
                        
                    </div>
                    <br />
                    <div>
                        <h3>Update Student</h3>
                        <form onSubmit={ onSave }>
                            <label> First Name</label>
                            <input type='text' name = 'firstName' value = { firstName } onChange={ onChangeStudent } />
                            {
                                errors.firstName
                            }
                            <br/>
                            <label>Last Name</label>
                            <input type='text' name = 'lastName' value = { lastName } onChange={ onChangeStudent }/>
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
                            <br />
                            <label>Campus Name</label>
                            <input type='text' name = 'campusName' value = { campusName } onChange={ onChangeStudent }/>
                            {
                                errors.campusName
                            }
                            <br />
                            <button className="btn btn-primary">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ campuses, students }, { id }) => {
    const student = students.find(student => student.id === id);
    const campusNames = campuses.reduce((list, campus) => {
        if (!list[campus.id]) {
            list[campus.id] = campus.name;
        } 
        return list;
    }, {})
    const campusNamesOnly = campuses.map(campus => campus.name)
    return {
        selectedStudent: student,
        campusNames,
        campuses,
        campusNamesOnly
    }
}

const mapDispatchToProps = (dispatch, { history }) => {
    return {
        updateStudent: (student) => dispatch(updateStudent(student, history)),
        deleteStudent: (student) => dispatch(deleteStudent(student, history)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Student);