import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { updateCampus, deleteCampus, createStudent } from './store';

class Campus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.selectedCampus.name ? this.props.selectedCampus.name : '',
            imageURL: this.props.selectedCampus.imageURL ? this.props.selectedCampus.imageURL : '',
            description: this.props.selectedCampus.description ? this.props.selectedCampus.description : '',
            errors: {},
            newStudent: {}
        }
        this.validators = {
            name: (value) => {
                if (!value) {
                    return '  Sorry, name is required';
                }
            }
        }

        this.onChangeCampus = this.onChangeCampus.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onSaveNewStudent = this.onSaveNewStudent.bind(this);
        this.onAddStudent = this.onAddStudent.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        this.setState({ name: nextProps.selectedCampus.name ? nextProps.selectedCampus.name : '' })
    }

    onDelete() {
        this.props.deleteCampus({ id: this.props.id });
    }

    onChangeCampus(ev) {
        const change = {};
        change[ev.target.name] = ev.target.value;
        this.setState(change);
    }

   onSaveNewStudent(ev) {
        event.preventDefault();
        this.props.createStudent({
            id: this.state.id
        })
    
    }

    onAddStudent(event) {
        const newStudent = this.props.otherStudents.find(student => student.id === event.target.value)
        this.setState({ newStudent });
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
            id: this.props.id,
            name: this.state.name,
            imageURL: this.state.imageURL,
            description: this.state.description
        };
        this.props.updateCampus(campus);
    }

    render() {
        const { selectedCampus, numberOfStudents, studentsAtCampus, otherStudents } = this.props;
        const { onDelete, onSave, onChangeCampus, onAddStudent, onSaveNewStudent } = this;
        const { name, imageURL, description, newStudentId, errors } = this.state;
        if (!selectedCampus) {
            return null;
        }

        return (
           <div>          
                <div className="container">               
                    <div className="row">
                        <h2>{ selectedCampus.name }</h2>
                        <img src={ selectedCampus.imageURL } /> 
                        <p>{ selectedCampus.description }</p>
                        <br />
                        <button className="btn btn-primary"onClick={ onDelete }>Delete Campus</button>
                        <h3>Students on Campus</h3>
                            {                           
                                studentsAtCampus.map(student => {
                                    return (
                                        <div className="col-sm" key = { student.id }>
                                            <img src= '/images/student.jpeg' /> 
                                            <h4><Link to = {`/students/${student.id}`}>{ student.fullName }</Link></h4>   
                                        </div>  
                                    )
                                })
                            }
                            { numberOfStudents === 0 ? (<h4>Sorry, there are no students.</h4>) : ('') } 
                            
                        
                    </div>
                    <br />
                    <div>
                        <h3>Update Campus</h3>
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
                            <p>  </p>
                            <button>Save Changes</button>
                        </form>
                    </div>
                    <div>
                        <form onSubmit = { onSaveNewStudent }>
                            <select value = { newStudentId } onChange = { onAddStudent }>
                                <option value = ''> --Add Student--</option>
                                {
                                    otherStudents.map(student=> {
                                        return (
                                            
                                            <option key = { student.id } value = { student.id}> { student.fullName } </option>
                                        )
                                    })
                                }                       
                            </select>
                            <br />
                            <button>Add Student</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ campuses, students }, { id }) => {
    const campus = campuses.find(campus => campus.id === id);
    const studentsAtCampus = students.filter(student => student.campusId === id);
    const otherStudents = students.filter(student => student.campusId !== id);
    const numberOfStudents = studentsAtCampus.length;
    return {
        selectedCampus: campus,
        studentsAtCampus,
        numberOfStudents,
        otherStudents
    }
}

const mapDispatchToProps = (dispatch, { history }) => {
    return {
        updateCampus: (campus) => dispatch(updateCampus(campus, history)),
        deleteCampus: (campus) => dispatch(deleteCampus(campus, history)),
        createStudent: (student) => dispatch(createStudent(student, history))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Campus);