import React, { Component } from 'react';
import release from 'release.json';
import { CLIENT_API_URL } from "constants/request";
import axiosInstance from "config/axiosInstance";
import Button from "components/CustomButtons/Button.js";

/**
 * Release class
 */
class Release extends Component {

    /**
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            isLoading: false,
            error: null
        };
    }

    /**
     *  Init
     */
    init() {
        this.setState({data: [], isLoading: false, error: null });

        this._getAdminApiRelease();
        this._getAdminFrontendRelease();
        this._getClientApiRelease();
        this.render();
    }

    /**
     * Did mount
     */
    componentDidMount() {
        this.init();
    }

    /**
     * Get admin api release
     *
     * @private
     */
    _getAdminApiRelease(name = 'Admin panel API') {
        this.setState({ isLoading: true });

        axiosInstance
            .get(`/release/info`)
            .then(response => {
                if (typeof response?.data?.data !== 'undefined') {
                    response.data.data.name = name;
                    this.setState(prevState => ({
                        data: [
                            ...prevState.data,
                            response.data.data
                        ],
                        isLoading: false
                    }))
                } else {
                    console.log('Data for ' + name + ' has not loaded!');
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({isLoading: false, error: error });
            });
    }

    /**
     * Get client api release
     *
     * @private
     */
    _getClientApiRelease(name = 'Client API') {
        this.setState({ isLoading: true });

        fetch(CLIENT_API_URL + `/release/info`)
            .then(response => response.json())
            .then(response => {
                if (typeof response?.data !== 'undefined') {
                    response.data.name = name;
                    this.setState(prevState => ({
                        data: [
                            ...prevState.data,
                            response.data
                        ],
                        isLoading: false
                    }))
                } else {
                    console.log('Data for ' + name + ' has not loaded!');
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({isLoading: false, error: error });
            });
    }

    /**
     *  Get admin frontend release
     *
     * @private
     */
    _getAdminFrontendRelease() {
        this.setState({ isLoading: true });
        release.name = 'Admin panel frontend';
        this.setState(prevState => ({
            data: [
                ...prevState.data,
                release
            ],
            isLoading: false
        }))
    }

    /**
     * Render
     *
     * @returns {*}
     */
    render() {
        let self = this;

        if (this.state.isLoading) {
            return (
                <div>
                    <p><b>Loading...</b></p>
                </div>
            );
        }

        if (this.state.error) {
            return (
                <div>
                    <p><b><font color="red">{this.state.error}</font></b></p>
                </div>
            );
        }

        return (
            <div>
                {
                    this.state.data.map(((item, i) =>
                                <div key={i}>
                                    <p><b>{item.name ? item.name : 'n/a'}:</b></p>
                                    <p>Branch: {item.branch ? item.branch : 'n/a'}</p>
                                    <p>Commit: {item.commit ? item.commit : 'n/a'}</p>
                                    <p>Author: {item.author ? item.author : 'n/a'}</p>
                                    <p>Date: {item.date ? item.date : 'n/a'}</p>
                                </div>
                        )
                    )
                }
                <Button
                    color="info"
                    type="button"
                    onClick={function() {self.init()}}
                    xs={12}
                    sm={12}
                    md={12}
                >Check update
                </Button>
            </div>
        );
    };
}

/**
 *  Class export
 */
export default Release;