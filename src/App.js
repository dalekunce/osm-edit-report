import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';
// import logo from './logo.svg';
import {getStats} from './store/stats.actions';
import Header from './components/Header';
import Body from './components/Body';

class App extends Component {
    static propTypes = {
        actions: React.PropTypes.object
    }

    constructor(props) {
        super(props);
        props.actions.getStats();
    }

    render() {
        return (
            <div className="viewport-full col--10-ml col--10-mxl col--offl1-ml col--offl1-mxl">
                <Header />
                <Body />
                <div className="flex-parent flex-parent--column">
                    {
                        Array.isArray(this.props.stats.rawData) && this.props.stats.rawData.map((e,i) => {
                            return <div key={i} className="m6 color-gray-dark bg-yellow-light flex-child">{JSON.stringify(e, null, 2)}</div>
                        })  
                    }
                </div>
            </div>
        );
    }
}

App = connect(state => state, (dispatch) => ({
    actions: bindActionCreators({getStats}, dispatch)
}))(App);

export default (App);

