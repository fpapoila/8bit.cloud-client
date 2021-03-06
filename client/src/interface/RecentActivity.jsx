/**
 * @jsx React.DOM
 */

var React       = require('react/addons'),
    mixins      = require('./mixins/mixins.jsx'),
    Activity    = require('./Activity.jsx'),
    _           = require('lodash'),
    moment      = require('moment'),
    api         = require('socket.io-client')('/api');

module.exports = React.createClass({

    mixins: [mixins.listener],

    getInitialState: function() {
        return {
            activities: []
        };
    },

    getDefaultProps: function() {

    return {
            activities: [],
            navable: true,
            navStack: 2,
            icon: "ion-ios-people ",
            functionCall: "highlightPanel",
            functionParams: "panel_activity",
            classString: "slide col-xs-4",
            stackLength: 4,
            actionSet: [],
            id: "recent_activity",
            title: "Recent Activity",
            items: []
        };
    },


    reverseOrder: function() {

        // Reverse navigation
        var docs = document.querySelectorAll("#recent_activity [data-snav]");

        if (docs.length > 1) {

            _.forEach(docs, function (item, i) {
                i++;
                item.setAttribute("data-snav", i);
            });

        }

    },

    componentDidUpdate: function() {
        this.reverseOrder();
    },

    componentDidMount: function() {

        api.on('network-api', this.setState.bind(this));

    },

    render: function() {

        var actionSet = this.props.actionSet;

        var activityNodes = this.state.activities.map(function (activity, i) {

          return <Activity actionSet={actionSet} key={i.id} navStack={i+1} username={activity.Username} action={activity.Type} game={activity.Software} timestamp={ activity.Timestamp } />
        });

        nodes = activityNodes.length;

        if (activityNodes.length > 1) {

            var d;
            var sorted = _.sortBy(activityNodes, function(arrayElement) {
                d = new Date(arrayElement.props.timestamp);
                return d.getTime();
            });

            activityNodes = sorted;

            activityNodes.reverse();

            activityNodes = _.slice(activityNodes, 0, 4);

        }


        return (

            <div className={this.props.classString} id={this.props.id}>
                <table className="table navable navable-row" data-function={this.props.functionCall} data-parameters={this.props.functionParams} id="panel_activity">
                    <thead>
                        <th>
                            <h4> <i className={this.props.icon}></i></h4>
                        </th>

                        <th colSpan='2'>
                          <h4 className="text-right">{this.props.title}</h4>
                        </th>
                    </thead>

                    <tbody>

                    { nodes ? activityNodes : <td colSpan="2"><h2>No Recent Activity</h2></td> }

                   </tbody>
                </table>
            </div>

        );
    }
});
