import React from 'react';
import spinner from "../assets/images/spinner.png";
import trx_icon from "../assets/images/trx-icon.svg";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="loading-overlay">
                    <div className="spinner"><img src={spinner} alt="" id="spinner"
                                                  className="spinner__image spin"
                                                  draggable="false"/><img
                        src={trx_icon} className="spinner__icon" alt="" draggable="false"/></div>
                    <span>Internal error. Something went wrong.</span>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;