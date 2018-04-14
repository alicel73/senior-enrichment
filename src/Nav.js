import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Nav extends Component {
    render () {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <ul className="nav navbar-nav">
                        <li>
                            <Link to = '/'>Home</Link>
                        </li>
                        <li>
                            <Link to = '/students'>Students</Link>
                        </li>
                        <li>
                            <Link to = '/campuses'>Campuses</Link>
                        </li>
                    </ul>
                </div>
          </nav>
        )
    }

}

/*const Nav = ({ }) => {
    return (
        <ul>
            <li>
                <Link to = '/'>Home</Link>
            </li>
            <li>
                <Link to = '/students'>Students</Link>
            </li>
            <li>
                <Link to = '/campuses'>Campuses</Link>
            </li>           
        </ul>
    )
}*/


const mapStateToProps = ({ students, campuses }) => {
    return {
        students,
        campuses
    }
}

export default connect(mapStateToProps)(Nav);