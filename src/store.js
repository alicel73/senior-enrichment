import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';


const SET_CAMPUSES = 'SET_CAMPUSES';
const SET_STUDENTS = 'SET_STUDENTS';
const CREATE_CAMPUS = 'CREATE_CAMPUS';
const DELETE_CAMPUS = 'DELETE CAMPUS';
const UPDATE_CAMPUS = 'UPDATE CAMPUS';
const CREATE_STUDENT = 'CREATE_STUDENT';
const DELETE_STUDENT = 'DELETE STUDENT';
const UPDATE_STUDENT = 'UPDATE STUDENT';

const campusesReducer = (state = [], action) => {
    switch(action.type) {
        case SET_CAMPUSES:
            state = action.campuses;
            break;
        case CREATE_CAMPUS:
            state = [...state, action.newCampus];
            break;
        case DELETE_CAMPUS:
            state = state.filter(campus => campus.id !== action.deletedCampus.id);
            break;
        case UPDATE_CAMPUS:
            state = state.map(campus => campus.id === action.updatedCampus.id ? action.updatedCampus : campus)
    }

    return state;
}

const studentsReducer = (state=[], action) => {
    switch(action.type) {
        case SET_STUDENTS:
            state = action.students;
            break;
        case CREATE_STUDENT:
            state = [...state, action.newStudent];
            break;
        case DELETE_CAMPUS:
            state = state.filter(campus => campus.id !== action.deletedCampus.id);
            break; 
        case DELETE_STUDENT:
            state = state.filter(student => student.id !== action.deletedStudent.id);
            break;
        case UPDATE_STUDENT:
            state = state.map(student => student.id === action.updatedStudent.id ? action.updatedStudent : student)
    }
    return state;
}

const reducer = combineReducers({
    campuses: campusesReducer,
    students: studentsReducer
})

const loadStudents = () => {
    return (dispatch) => {
        return axios.get('/api/students')
            .then (result=> result.data)
            .then (students => dispatch({
                type: SET_STUDENTS,
                students
            }))
    }
}

const loadCampuses = () => {
    return (dispatch) => {
        return axios.get('/api/campuses')
            .then (result => result.data)
//            .then ((campuses) => console.log(campuses))
            .then (campuses => dispatch({
                type: SET_CAMPUSES,
                campuses
            }))
    }
}

const createStudent = (student, history) => {
    return (dispatch) => {
        let newLocation = {};
        return axios.post('/api/campuses', student)
            .then (result => result.data)
            .then (student => {
                return newLocation = student
            })
            .then (student=> dispatch({
                type: CREATE_CAMPUS,
                newCampus: student
            }))
            .then(() => {
                history.push(`/students/${newLocation.id}`)
            })

    }
}

const createCampus = (campus, history) => {
    return (dispatch) => {
        let newLocation = {};
        return axios.post('/api/campuses', campus)
            .then (result => result.data)
            .then (campus => {
                return newLocation = campus
            })
            .then (campus => dispatch({
                type: CREATE_CAMPUS,
                newCampus: campus
            }))
            .then(() => {
                history.push(`/campuses/${newLocation.id}`)
            })
    }
}

const deleteStudent = (student, history) => {
    return (dispatch) => {
        return axios.delete(`/api/students/${student.id}`)
            .then(() => dispatch({
                type: DELETE_STUDENT,
                deletedStudent: student
            }))
            .then(() => {
                history.push('/students')
            })
    }
}

const deleteCampus = (campus, history) => {
    return (dispatch) => {
        return axios.delete(`api/campuses/${campus.id}`)
            .then(() => dispatch({
                type: DELETE_CAMPUS,
                deletedCampus: campus
            }))
            .then(() => {
                history.push('/campuses')
            })
    }
}

const updateStudent = (student) => {
    return (dispatch) => {
        return axios.put(`/api/students/${student.id}`, student)
            .then(()=> dispatch({
                type: UPDATE_STUDENT,
                updatedStudent: student
            }))
    }
}

const updateCampus = (campus) => {
    return (dispatch) => {
        return axios.put(`api/campuses/${campus.id}`, campus)
            .then(() => dispatch({
                type: UPDATE_CAMPUS,
                updatedCampus: campus
            }))
    }
}

const store = createStore(reducer, applyMiddleware(thunk));

export default store;

export { loadStudents, loadCampuses, createStudent, createCampus, deleteStudent, deleteCampus, updateStudent, updateCampus }