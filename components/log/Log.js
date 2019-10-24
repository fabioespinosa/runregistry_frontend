import React, { Component } from 'react';
import axios from 'axios';
import { error_handler } from '../../utils/error_handlers';
import { api_url } from '../../config/config';
import Event from './event/Event';
import { Timeline, Button } from 'antd';

const INITIAL_PAGE_SIZE = 100;
class LogViewer extends Component {
    state = {
        events: [],
        page: 0,
        pages: 0,
        count: 0
    };

    componentDidMount = () => this.fetchEvents(0);

    fetchEvents = error_handler(async page => {
        const { data } = await axios.post(`${api_url}/events/get_events`, {
            page,
            page_size: INITIAL_PAGE_SIZE
        });

        const { events, pages, count } = data;
        this.setState({
            events: [...this.state.events, ...events],
            pages,
            count,
            page
        });
    });

    generateDot = event => {
        const {
            version,
            comment,
            by,
            createdAt,
            RunEvent,
            DatasetEvent,
            LumisectionEvent,
            OMSLumisectionEvent
        } = event;
        let dot = <Icon type="clock-circle-o" style={{ fontSize: '16px' }} />;
        let color = 'white';
        if (RunEvent !== null) {
            color = 'blue';
            dot = <Icon type="clock-circle-o" style={{ fontSize: '20px' }} />;
        }
        if (DatasetEvent !== null) {
            color = 'yellow';
        }
        if (LumisectionEvent !== null) {
            color = 'gray';
        }
        if (OMSLumisectionEvent !== null) {
            color = 'black';
        }
    };
    render() {
        return (
            <div>
                <center>
                    <h1>Log of Events in Run Registry</h1>
                </center>
                <br />
                <div>
                    <Timeline mode="alternate">
                        {this.state.events.map(event => (
                            <Timeline.Item
                                key={event.version}
                                // dot={event => this.generateDot(event)}
                            >
                                <Event event={event}></Event>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </div>
                <center>
                    <Button
                        onClick={() => this.fetchEvents(this.state.page + 1)}
                    >
                        Load more...
                    </Button>
                </center>
            </div>
        );
    }
}

export default LogViewer;
