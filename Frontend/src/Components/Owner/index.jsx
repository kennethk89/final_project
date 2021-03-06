import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './owner.css'
import axios from 'axios'

class Owner extends Component {
    state = {
        owTotalTables: 0,
        owOccupiedTables: 0,
        owTotalCapacity: 0,
        owCurrentCapacity: 0,
        restName: ''
    }

    //parse capacities above instead of chaining after component mounts
    parseTotalCapacity(data) {
        let thing = data.map((table, i) => {
            return table.total_pax
        })

        return thing.reduce((acc, cur) => {
            return acc + cur
        }, 0)

    }


    componentWillMount() {
        axios.post("http://localhost:8080/api/ownerFilter", {
            id: this.props.match.params.restId
        })
            .then((response) => {
                console.log(response.data[0].name)
                let tableCounter = 0
                let occupiedCounter = 0

                let owTotalCapacity = this.parseTotalCapacity(response.data)

                let ownerOccupiedJSX = response.data.map((table, i) => {
                    return table.current_pax
                })
                response.data.forEach((table, i) => {
                    if (table.current_pax !== 0) {
                        occupiedCounter++
                    }
                    return tableCounter++
                })

                this.setState({
                    owTotalCapacity: owTotalCapacity,
                    owCurrentCapacity: ownerOccupiedJSX.reduce((acc, cur) => {
                        return acc + cur
                    }, 0),
                    owTotalTables: tableCounter,
                    owOccupiedTables: occupiedCounter,
                    restName: response.data[0].name
                })
            })
    }

    componentDidUpdate() {
        axios.post("http://localhost:8080/api/ownerFilter", {
            id: this.props.match.params.restId
        })
            .then((response) => {
                let tableCounter = 0
                let occupiedCounter = 0

                let ownerCapacityJSX = response.data.map((table, i) => {
                    return table.total_pax
                })
                let ownerOccupiedJSX = response.data.map((table, i) => {
                    return table.current_pax
                })
                response.data.forEach((table, i) => {
                    if (table.current_pax !== 0) {
                        occupiedCounter++
                    }
                    return tableCounter++
                })

                this.setState({
                    owTotalCapacity: ownerCapacityJSX.reduce((acc, cur) => {
                        return acc + cur
                    }, 0),
                    owCurrentCapacity: ownerOccupiedJSX.reduce((acc, cur) => {
                        return acc + cur
                    }, 0),
                    owTotalTables: tableCounter,
                    owOccupiedTables: occupiedCounter
                })
            })
    }

    render() {
        const { restId } = this.props.match.params
        const capPercent = Math.ceil((this.state.owCurrentCapacity / this.state.owTotalCapacity) * 100)
        return (
            <div className="owner">
                <header className="Owner-header oInfo col-12">
                    <h2 className="Owner-title">{this.state.restName}</h2>
                </header>

                <p className="ownerInfo oInfo">Your restaurant is currently {capPercent}% full</p>
                <p className="ownerInfo oInfo">Total tables: {this.state.owTotalTables}</p>
                <p className="ownerInfo oInfo">Tables occupied: {this.state.owOccupiedTables}</p>
                <p className="ownerInfo oInfo">Total capacity: {this.state.owTotalCapacity}</p>
                <p className="ownerInfo oInfo">Current capacity: {this.state.owCurrentCapacity}</p>
                
                {/* <button onClick={this.props.makeRest}>make new restaurant</button>
                <button onClick={this.props.makeTable}>get the table!</button> */}

                <Link to={`/ops/${restId}`}><button className="ownerPageButton waves-effect waves-light btn">Go to ops</button></Link>

            </div>
        )
    }
}

export default Owner;
